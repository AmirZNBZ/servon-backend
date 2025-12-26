import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ServicesService } from './services.service.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { RequirePermissions } from '../auth/decorators/permissions.decorator.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('CREATE_SERVICE')
  create(@Body() dto: CreateServiceDto) {
    console.log("create")
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
