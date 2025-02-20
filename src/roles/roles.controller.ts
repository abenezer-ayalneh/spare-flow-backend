import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { Roles } from './decorators/roles.decorator'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolesService } from './roles.service'
import { Role } from './types/roles.type'

@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	@Roles(Role.ADMIN)
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto)
	}

	@Get()
	findAll() {
		return this.rolesService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.rolesService.findOne(+id)
	}

	@Patch(':id')
	@Roles(Role.ADMIN)
	update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.rolesService.update(+id, updateRoleDto)
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	remove(@Param('id') id: string) {
		return this.rolesService.remove(+id)
	}
}
