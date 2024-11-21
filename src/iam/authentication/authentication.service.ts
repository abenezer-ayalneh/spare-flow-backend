import { randomUUID } from 'node:crypto'

import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { PrismaService } from '../../prisma/prisma.service'
import jwtConfig from '../config/jwt.config'
import InvalidatedRefreshTokenError from '../errors/invalidated-refresh-token.error'
import HashingService from '../hashing/hashing.service'
import { ActiveUserData } from '../types/active-user-data.type'
import { RefreshTokenData } from '../types/refresh-token-data.type'
import RefreshTokenDto from './dto/refresh-token.dto'
import SignInDto from './dto/sign-in.dto/sign-in.dto'
import SignUpDto from './dto/sign-up.dto/sign-up.dto'
import RefreshTokenIdsStorage from './refresh-token-ids.storage/refresh-token-ids.storage'

@Injectable()
export default class AuthenticationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly hashingService: HashingService,
		private readonly jwtService: JwtService,
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
	) {}

	async signUp(signUpDto: SignUpDto) {
		try {
			if (signUpDto.password !== signUpDto.confirmPassword) {
				throw Error('Password and confirm password mismatch')
			}
			const password = await this.hashingService.hash(signUpDto.password)
			await this.prismaService.user.create({
				data: { username: signUpDto.username, password, name: signUpDto.name, roleId: signUpDto.roleId },
			})
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					throw new ConflictException()
				}
			}
			throw e
		}
	}

	async signIn(signInDto: SignInDto) {
		const user = await this.prismaService.user.findFirst({
			where: { username: signInDto.username },
		})
		if (!user) {
			throw new UnauthorizedException('User does not exists')
		}

		const isEqual = await this.hashingService.compare(signInDto.password, user.password)
		if (!isEqual) {
			throw new UnauthorizedException('Email or password mismatch')
		}

		return this.generateTokens(user)
	}

	async generateTokens(user: User) {
		const refreshTokenId = randomUUID()
		const [accessToken, refreshToken] = await Promise.all([
			this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, { username: user.username }),
			this.signToken<Partial<RefreshTokenData>>(user.id, this.jwtConfiguration.refreshTokenTtl, { refreshTokenId }),
		])
		await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId)
		return { accessToken, refreshToken }
	}

	async signToken<T>(userId: number, expiresIn: number, payload?: T) {
		return this.jwtService.signAsync(
			{
				sub: userId,
				...payload,
			},
			{
				audience: this.jwtConfiguration.audience,
				issuer: this.jwtConfiguration.issuer,
				secret: this.jwtConfiguration.secret,
				expiresIn,
			},
		)
	}

	async refreshTokens(refreshTokenDto: RefreshTokenDto) {
		try {
			const { sub, refreshTokenId } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'> & RefreshTokenData>(refreshTokenDto.refreshToken, {
				secret: this.jwtConfiguration.secret,
				audience: this.jwtConfiguration.audience,
				issuer: this.jwtConfiguration.issuer,
			})
			const user = await this.prismaService.user.findFirstOrThrow({
				where: { id: sub },
			})

			const isValid = await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId)
			if (isValid) {
				await this.refreshTokenIdsStorage.invalidate(user.id)
			} else {
				throw new Error('Refresh token is invalid')
			}

			return await this.generateTokens(user)
		} catch (e) {
			if (e instanceof InvalidatedRefreshTokenError) {
				throw new UnauthorizedException('Access denied')
			}
			throw new UnauthorizedException()
		}
	}

	async checkToken(userId: number) {
		return this.prismaService.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				name: true,
				active: true,
			},
		})
	}
}
