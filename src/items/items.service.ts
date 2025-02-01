import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { UpdatePriceDto } from './dto/update-price.dto'

@Injectable()
export class ItemsService {
	constructor(private readonly prismaService: PrismaService) {}

	create(createItemDto: CreateItemDto) {
		return this.prismaService.item.create({
			data: {
				name: createItemDto.name,
				price: createItemDto.price,
				source: createItemDto.source,
				description: createItemDto.description,
				partNumber: createItemDto.partNumber,
				ShelfItem: { create: { shelfLocationId: createItemDto.shelfId, quantity: createItemDto.quantity } },
			},
		})
	}

	findAll() {
		return this.prismaService.item.findMany({
			select: {
				id: true,
				name: true,
				price: true,
				source: true,
				description: true,
				partNumber: true,
				ShelfItem: {
					select: {
						id: true,
						quantity: true,
						ShelfLocation: { select: { id: true, name: true, Store: { select: { id: true, name: true } } } },
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	findOne(id: number) {
		return this.prismaService.item.findUnique({ where: { id } })
	}

	update(id: number, updateItemDto: UpdateItemDto) {
		return this.prismaService.item.update({
			where: { id },
			data: {
				name: updateItemDto.name,
				partNumber: updateItemDto.partNumber,
				description: updateItemDto.description ?? undefined,
				source: updateItemDto.source,
				ShelfItem: {
					update: {
						where: {
							id: 1,
						},
						data: {
							shelfLocationId: updateItemDto.shelfId,
						},
					},
				},
			},
		})
	}

	remove(id: number) {
		return this.prismaService.item.delete({ where: { id } })
	}

	getItemsList() {
		return this.prismaService.shelfItem.findMany({
			select: {
				id: true,
				quantity: true,
				Item: { select: { id: true, name: true, price: true, source: true, description: true, partNumber: true } },
				ShelfLocation: { select: { id: true, name: true, Store: { select: { id: true, name: true } } } },
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async checkShelfLocationInsideStore(storeId: number, shelfId: number) {
		const shelf = await this.prismaService.shelf.findUnique({ where: { id: shelfId } })

		if (!shelf) {
			throw new NotFoundException('No shelf found')
		}

		if (shelf.storeId !== storeId) {
			throw new ConflictException('Shelf and Store Mismatch')
		}

		return true
	}

	updatePrice(id: number, updatePriceDto: UpdatePriceDto) {
		return this.prismaService.item.update({
			where: { id },
			data: {
				price: updatePriceDto.price,
			},
		})
	}
}
