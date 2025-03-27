import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe, Logger, BadRequestException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioInfoDto } from './dto/create-usuario-info.dto';
import { UpdateUsuarioInfoDto } from './dto/update-usuario-info.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body(ValidationPipe) createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  // Endpoints para la información adicional en MongoDB
  @Post(':id/info')
  async createInfo(
    @Param('id') id: string,
    @Body() createUsuarioInfoDto: CreateUsuarioInfoDto,
  ) {
    try {
      this.logger.log(`Iniciando creación de información adicional para usuario ID: ${id}`);
      this.logger.debug('Datos recibidos:', createUsuarioInfoDto);
      
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }
      
      const dto = {
        ...createUsuarioInfoDto,
        userId
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
        metatype: CreateUsuarioInfoDto,
      });
      
      this.logger.debug('DTO validado');
      const result = await this.usuariosService.createInfo(validatedDto);
      
      this.logger.log('Información adicional creada exitosamente:', result);
      return result;
    } catch (error) {
      this.logger.error('Error al crear información adicional:', error);
      throw error;
    }
  }

  @Get(':id/info')
  async findInfo(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.log(`Buscando información adicional para usuario ID: ${id}`);
      const result = await this.usuariosService.findInfoByUserId(id);
      this.logger.log('Información adicional encontrada:', result);
      return result;
    } catch (error) {
      this.logger.error('Error al buscar información adicional:', error);
      throw error;
    }
  }

  @Patch(':id/info')
  async updateInfo(
    @Param('id') id: string,
    @Body() updateUsuarioInfoDto: UpdateUsuarioInfoDto,
  ) {
    try {
      this.logger.log(`Iniciando actualización de información adicional para usuario ID: ${id}`);
      this.logger.debug('Datos recibidos:', updateUsuarioInfoDto);
      
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }
      
      const dto = {
        ...updateUsuarioInfoDto,
        userId
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
        metatype: UpdateUsuarioInfoDto,
      });
      
      this.logger.debug('DTO validado');
      const result = await this.usuariosService.updateInfo(userId, validatedDto);
      
      this.logger.log('Información adicional actualizada exitosamente:', result);
      return result;
    } catch (error) {
      this.logger.error('Error al actualizar información adicional:', error);
      throw error;
    }
  }
} 