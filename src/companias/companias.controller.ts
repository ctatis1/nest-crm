import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CompaniasService } from './companias.service';
import { CreateCompaniaDto } from './dto/create-compania.dto';
import { UpdateCompaniaDto } from './dto/update-compania.dto';
import { CreateCompaniaInfoDto } from './dto/create-compania-info.dto';
import { UpdateCompaniaInfoDto } from './dto/update-compania-info.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Logger } from '@nestjs/common';

@Controller('companias')
@UseGuards(JwtAuthGuard)
export class CompaniasController {
  private readonly logger = new Logger(CompaniasController.name);

  constructor(private readonly companiasService: CompaniasService) {}

  @Public()
  @Post()
  create(@Body(ValidationPipe) createCompaniaDto: CreateCompaniaDto) {
    return this.companiasService.create(createCompaniaDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.companiasService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companiasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCompaniaDto: UpdateCompaniaDto,
  ) {
    return this.companiasService.update(id, updateCompaniaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiasService.remove(id);
  }

  // Endpoints para la información adicional en MongoDB
  @Post(':id/info')
  async createInfo(
    @Param('id') id: string,
    @Body() createCompaniaInfoDto: CreateCompaniaInfoDto,
  ) {
    try {
      this.logger.log(`Iniciando creación de información adicional para compañía ID: ${id}`);
      this.logger.debug('Datos recibidos:', createCompaniaInfoDto);
      
      const companiaId = parseInt(id, 10);
      if (isNaN(companiaId)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }
      
      const dto = {
        ...createCompaniaInfoDto,
        companiaId
      };
      
      const validationPipe = new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      });
      
      const validatedDto = await validationPipe.transform(dto, {
        type: 'body',
        metatype: CreateCompaniaInfoDto,
      });
      
      this.logger.debug('DTO validado');
      const result = await this.companiasService.createInfo(validatedDto);
      
      this.logger.log('Información adicional creada exitosamente:', result);
      return result;
    } catch (error) {
      this.logger.error('Error al crear información adicional:', error);
      throw error;
    }
  }

  @Public()
  @Get(':id/info')
  findInfo(@Param('id', ParseIntPipe) id: number) {
    return this.companiasService.findInfoByCompaniaId(id);
  }

  @Patch(':id/info')
  async updateInfo(
    @Param('id') id: string,
    @Body() updateCompaniaInfoDto: UpdateCompaniaInfoDto,
  ) {
    try {
      this.logger.log(`Iniciando actualización de información adicional para compañía ID: ${id}`);
      this.logger.debug('Datos recibidos:', updateCompaniaInfoDto);
      
      const companiaId = parseInt(id, 10);
      if (isNaN(companiaId)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }
      
      const dto = {
        ...updateCompaniaInfoDto,
        companiaId
      };
      
      const validationPipe = new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      });
      
      const validatedDto = await validationPipe.transform(dto, {
        type: 'body',
        metatype: UpdateCompaniaInfoDto,
      });
      
      this.logger.debug('DTO validado');
      const result = await this.companiasService.updateInfo(companiaId, validatedDto);
      
      this.logger.log('Información adicional actualizada exitosamente:', result);
      return result;
    } catch (error) {
      this.logger.error('Error al actualizar información adicional:', error);
      throw error;
    }
  }
} 