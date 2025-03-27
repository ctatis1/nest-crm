import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compania } from '../entities/compania.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompaniaInfo, CompaniaInfoDocument } from '../schemas/compania-info.schema';
import { CreateCompaniaDto } from './dto/create-compania.dto';
import { UpdateCompaniaDto } from './dto/update-compania.dto';
import { CreateCompaniaInfoDto } from './dto/create-compania-info.dto';
import { UpdateCompaniaInfoDto } from './dto/update-compania-info.dto';
import { DepartamentosService } from '../departamentos/departamentos.service';
import { CiudadesService } from '../ciudades/ciudades.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CompaniasService {
  constructor(
    @InjectRepository(Compania)
    private companiaRepository: Repository<Compania>,
    @InjectModel(CompaniaInfo.name)
    private companiaInfoModel: Model<CompaniaInfoDocument>,
    private departamentosService: DepartamentosService,
    private ciudadesService: CiudadesService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createCompaniaDto: CreateCompaniaDto): Promise<Compania> {
    try {
      console.log('Iniciando creación de compañía:', createCompaniaDto);
      
      console.log('Verificando departamento:', createCompaniaDto.departamentoId);
      await this.departamentosService.findOne(createCompaniaDto.departamentoId);
      
      console.log('Verificando ciudad:', createCompaniaDto.ciudadId);
      await this.ciudadesService.findOne(createCompaniaDto.ciudadId);
      
      console.log('Creando entidad de compañía');
      const compania = this.companiaRepository.create(createCompaniaDto);
      
      console.log('Guardando compañía en la base de datos');
      const savedCompania = await this.companiaRepository.save(compania);
      
      console.log('Compañía creada exitosamente:', savedCompania);
      this.eventEmitter.emit('company.created', savedCompania);
      
      return savedCompania;
    } catch (error) {
      console.error('Error al crear compañía:', error);
      throw error;
    }
  }

  async findAll(): Promise<Compania[]> {
    try {
      console.log('Buscando todas las compañías');
      const companias = await this.companiaRepository.find({
        relations: ['departamento', 'ciudad'],
      });
      console.log(`Se encontraron ${companias.length} compañías`);
      return companias;
    } catch (error) {
      console.error('Error al buscar todas las compañías:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Compania> {
    try {
      console.log(`Buscando compañía con ID: ${id}`);
      const compania = await this.companiaRepository.findOne({
        where: { id },
        relations: ['departamento', 'ciudad'],
      });
      
      if (!compania) {
        console.log(`Compañía con ID ${id} no encontrada`);
        throw new NotFoundException(`Compañía con ID ${id} no encontrada`);
      }
      
      console.log('Compañía encontrada:', compania);
      return compania;
    } catch (error) {
      console.error(`Error al buscar compañía con ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, updateCompaniaDto: UpdateCompaniaDto): Promise<Compania> {
    try {
      console.log(`Iniciando actualización de compañía con ID: ${id}`);
      console.log('Datos a actualizar:', updateCompaniaDto);
      
      const compania = await this.findOne(id);
      
      if (updateCompaniaDto.departamentoId) {
        console.log('Verificando nuevo departamento:', updateCompaniaDto.departamentoId);
        await this.departamentosService.findOne(updateCompaniaDto.departamentoId);
      }
      
      if (updateCompaniaDto.ciudadId) {
        console.log('Verificando nueva ciudad:', updateCompaniaDto.ciudadId);
        await this.ciudadesService.findOne(updateCompaniaDto.ciudadId);
      }
      
      console.log('Actualizando datos de la compañía');
      Object.assign(compania, updateCompaniaDto);
      
      console.log('Guardando cambios en la base de datos');
      const updatedCompania = await this.companiaRepository.save(compania);
      console.log('Compañía actualizada exitosamente:', updatedCompania);
      
      return updatedCompania;
    } catch (error) {
      console.error(`Error al actualizar compañía con ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const compania = await this.findOne(id);
    await this.companiaRepository.remove(compania);
    
    await this.companiaInfoModel.deleteOne({ companiaId: id }).exec();
  }

  // Métodos para la información adicional en MongoDB
  async createInfo(createCompaniaInfoDto: CreateCompaniaInfoDto): Promise<CompaniaInfo> {
    try {
      console.log('Iniciando creación de información adicional de compañía');
      console.log('Datos:', createCompaniaInfoDto);
      
      await this.findOne(createCompaniaInfoDto.companiaId);
      
      const info = new this.companiaInfoModel(createCompaniaInfoDto);
      const savedInfo = await info.save();
      
      console.log('Información adicional creada exitosamente:', savedInfo);
      return savedInfo;
    } catch (error) {
      console.error('Error al crear información adicional de compañía:', error);
      throw error;
    }
  }

  async findInfoByCompaniaId(companiaId: number): Promise<CompaniaInfo> {
    try {
      console.log(`Buscando información adicional para compañía ID: ${companiaId}`);
      const info = await this.companiaInfoModel.findOne({ companiaId }).exec();
      
      if (!info) {
        console.log(`Información adicional para compañía ${companiaId} no encontrada`);
        throw new NotFoundException(`Información adicional para compañía con ID ${companiaId} no encontrada`);
      }
      
      console.log('Información adicional encontrada:', info);
      return info;
    } catch (error) {
      console.error(`Error al buscar información adicional de compañía ${companiaId}:`, error);
      throw error;
    }
  }

  async updateInfo(companiaId: number, updateCompaniaInfoDto: UpdateCompaniaInfoDto): Promise<CompaniaInfo> {
    try {
      console.log(`Iniciando actualización de información adicional para compañía ID: ${companiaId}`);
      console.log('Datos a actualizar:', updateCompaniaInfoDto);
      
      const info = await this.findInfoByCompaniaId(companiaId);
      
      Object.assign(info, updateCompaniaInfoDto);
      const updatedInfo = await (info as CompaniaInfoDocument).save();
      
      console.log('Información adicional actualizada exitosamente:', updatedInfo);
      return updatedInfo;
    } catch (error) {
      console.error(`Error al actualizar información adicional de compañía ${companiaId}:`, error);
      throw error;
    }
  }
} 