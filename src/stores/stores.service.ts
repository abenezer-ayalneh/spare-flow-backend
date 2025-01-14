import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'

@Injectable()
export class StoresService {
	constructor(private readonly prismaService: PrismaService) {}

	create(createStoreDto: CreateStoreDto) {
		return this.prismaService.store.create({ data: createStoreDto })
	}

	findAll() {
		return this.prismaService.store.findMany({ orderBy: { createdAt: 'desc' } })
	}

	findOne(id: number) {
		return this.prismaService.store.findUnique({ where: { id } })
	}

	update(id: number, updateStoreDto: UpdateStoreDto) {
		return this.prismaService.store.update({ where: { id }, data: updateStoreDto })
	}

	remove(id: number) {
		return this.prismaService.store.delete({ where: { id } })
	}
}
