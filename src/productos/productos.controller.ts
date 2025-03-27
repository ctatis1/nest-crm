import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ValidationPipe, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateProductoInfoDto } from './dto/create-producto-info.dto';
import { UpdateProductoInfoDto } from './dto/update-producto-info.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Logger } from '@nestjs/common';

@Controller('productos')
@UseGuards(JwtAuthGuard)
export class ProductosController {
  private readonly logger = new Logger(ProductosController.name);

  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body(ValidationPipe) createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Public()
  @Get()
  findAll(@Query('companyId') companyId?: number) {
    if (companyId) {
      return this.productosService.findByCompania(companyId);
    }
    return this.productosService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }

  // Endpoints para la información adicional en MongoDB
  @Post(':id/info')
  async createInfo(
    @Param('id') id: string,
    @Body() createProductoInfoDto: CreateProductoInfoDto,
  ) {
    try {
      this.logger.log(`Iniciando creación de información adicional para producto ID: ${id}`);
      this.logger.debug('Datos recibidos:', createProductoInfoDto);
      
      const productoId = parseInt(id, 10);
      if (isNaN(productoId)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }
      
      const dto = {
        ...createProductoInfoDto,
        productoId
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
        metatype: CreateProductoInfoDto,
      });
      
      this.logger.debug('DTO validado');
      const result = await this.productosService.createInfo(validatedDto);
      
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
    return this.productosService.findInfoByProductoId(id);
  }

  @Patch(':id/info')
  async updateInfo(
    @Param('id') id: string,
    @Body() updateProductoInfoDto: UpdateProductoInfoDto,
  ) {
    try {
      this.logger.log(`Iniciando actualización de información adicional para producto ID: ${id}`);
      this.logger.debug('Datos recibidos:', updateProductoInfoDto);
      
      const productoId = parseInt(id, 10);
      if (isNaN(productoId)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }
      
      const dto = {
        ...updateProductoInfoDto,
        productoId
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
        metatype: UpdateProductoInfoDto,
      });
      
      this.logger.debug('DTO validado');
      const result = await this.productosService.updateInfo(productoId, validatedDto);
      
      this.logger.log('Información adicional actualizada exitosamente:', result);
      return result;
    } catch (error) {
      this.logger.error('Error al actualizar información adicional:', error);
      throw error;
    }
  }
} 