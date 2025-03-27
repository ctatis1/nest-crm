import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioInfo, UsuarioInfoDocument } from '../schemas/usuario-info.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioInfoDto } from './dto/create-usuario-info.dto';
import { UpdateUsuarioInfoDto } from './dto/update-usuario-info.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectModel(UsuarioInfo.name)
    private usuarioInfoModel: Model<UsuarioInfoDocument>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      console.log('Iniciando creación de usuario:', createUsuarioDto);
      
      console.log('Verificando si el email ya existe');
      const existingUser = await this.usuarioRepository.findOne({ 
        where: { email: createUsuarioDto.email } 
      });
      
      if (existingUser) {
        console.log('Email ya registrado');
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      
      console.log('Creando entidad de usuario');
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      
      console.log('Guardando usuario en la base de datos');
      const savedUsuario = await this.usuarioRepository.save(usuario);
      
      console.log('Usuario creado exitosamente:', savedUsuario);
      return savedUsuario;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  async findAll(): Promise<Usuario[]> {
    try {
      console.log('Buscando todos los usuarios');
      const usuarios = await this.usuarioRepository.find({
        relations: ['compania'],
        select: ['id', 'nombre', 'email', 'companyId']
      });
      console.log(`Se encontraron ${usuarios.length} usuarios`);
      return usuarios;
    } catch (error) {
      console.error('Error al buscar todos los usuarios:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Usuario> {
    try {
      console.log(`Buscando usuario con ID: ${id}`);
      const usuario = await this.usuarioRepository.findOne({
        where: { id },
        relations: ['compania'],
        select: ['id', 'nombre', 'email', 'companyId']
      });
      
      if (!usuario) {
        console.log(`Usuario con ID ${id} no encontrado`);
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      
      console.log('Usuario encontrado:', usuario);
      return usuario;
    } catch (error) {
      console.error(`Error al buscar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Usuario> {
    try {
      console.log(`Buscando usuario con email: ${email}`);
      const usuario = await this.usuarioRepository.findOne({
        where: { email }
      });
      
      if (!usuario) {
        console.log(`Usuario con email ${email} no encontrado`);
        throw new NotFoundException(`Usuario con email ${email} no encontrado`);
      }
      
      console.log('Usuario encontrado:', usuario);
      return usuario;
    } catch (error) {
      console.error(`Error al buscar usuario con email ${email}:`, error);
      throw error;
    }
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    try {
      console.log(`Iniciando actualización de usuario con ID: ${id}`);
      console.log('Datos a actualizar:', updateUsuarioDto);
      
      const usuario = await this.findOne(id);
      
      if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
        console.log('Verificando si el nuevo email ya existe');
        const existingUser = await this.usuarioRepository.findOne({ 
          where: { email: updateUsuarioDto.email } 
        });
        
        if (existingUser) {
          console.log('El nuevo email ya está registrado');
          throw new ConflictException('El correo electrónico ya está registrado');
        }
      }
      
      console.log('Actualizando datos del usuario');
      Object.assign(usuario, updateUsuarioDto);
      
      console.log('Guardando cambios en la base de datos');
      const updatedUsuario = await this.usuarioRepository.save(usuario);
      console.log('Usuario actualizado exitosamente:', updatedUsuario);
      
      return updatedUsuario;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
    
    await this.usuarioInfoModel.deleteOne({ userId: id }).exec();
  }

  // Métodos para la información adicional en MongoDB
  async createInfo(createUsuarioInfoDto: CreateUsuarioInfoDto): Promise<UsuarioInfo> {
    try {
      console.log('Iniciando creación de información adicional de usuario');
      
      const usuario = await this.findOne(createUsuarioInfoDto.userId);
      console.log('Usuario encontrado:', usuario.email);
      
      const existingInfo = await this.usuarioInfoModel.findOne({ userId: createUsuarioInfoDto.userId }).exec();
      if (existingInfo) {
        console.log('Ya existe información para este usuario');
        throw new ConflictException(`Ya existe información para el usuario con ID ${createUsuarioInfoDto.userId}`);
      }
      
      const info = new this.usuarioInfoModel(createUsuarioInfoDto);
      
      console.log('Guardando en MongoDB');
      const savedInfo = await info.save();
      
      console.log('Información adicional creada exitosamente');
      return savedInfo;
    } catch (error) {
      console.error('Error al crear información adicional de usuario:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.name === 'ValidationError') {
        console.error('Error de validación:', error.errors);
        throw new BadRequestException('Error de validación: ' + JSON.stringify(error.errors));
      }
      throw error;
    }
  }

  async findInfoByUserId(userId: number): Promise<UsuarioInfo> {
    try {
      console.log(`Buscando información adicional para usuario ID: ${userId}`);
      const info = await this.usuarioInfoModel.findOne({ userId }).exec();
      
      if (!info) {
        console.log(`Información adicional para usuario ${userId} no encontrada`);
        throw new NotFoundException(`Información adicional para usuario con ID ${userId} no encontrada`);
      }
      
      console.log('Información adicional encontrada:', info);
      return info;
    } catch (error) {
      console.error(`Error al buscar información adicional de usuario ${userId}:`, error);
      throw error;
    }
  }

  async updateInfo(userId: number, updateUsuarioInfoDto: UpdateUsuarioInfoDto): Promise<UsuarioInfo> {
    try {
      console.log(`Iniciando actualización de información adicional para usuario ID: ${userId}`);
      console.log('Datos a actualizar:', updateUsuarioInfoDto);
      
      const info = await this.findInfoByUserId(userId);
      
      Object.assign(info, updateUsuarioInfoDto);
      const updatedInfo = await (info as UsuarioInfoDocument).save();
      
      console.log('Información adicional actualizada exitosamente:', updatedInfo);
      return updatedInfo;
    } catch (error) {
      console.error(`Error al actualizar información adicional de usuario ${userId}:`, error);
      throw error;
    }
  }
} 