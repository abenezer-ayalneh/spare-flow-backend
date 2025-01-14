import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateShelfDto } from './dto/create-shelf.dto'
import { UpdateShelfDto } from './dto/update-shelf.dto'

@Injectable()
export class ShelvesService {
	constructor(private readonly prismaService: PrismaService) {}

	create(createShelfDto: CreateShelfDto) {
		return this.prismaService.shelf.create({ data: createShelfDto })
	}

	findAll() {
		return this.prismaService.shelf.findMany({ include: { Store: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } })
	}

	findOne(id: number) {
		return this.prismaService.shelf.findUnique({ where: { id } })
	}

	update(id: number, updateShelfDto: UpdateShelfDto) {
		return this.prismaService.shelf.update({ where: { id }, data: updateShelfDto })
	}

	remove(id: number) {
		return this.prismaService.shelf.delete({ where: { id } })
	}
}
