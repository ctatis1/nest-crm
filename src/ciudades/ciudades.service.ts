import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciudad } from '../entities/ciudad.entity';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { DepartamentosService } from '../departamentos/departamentos.service';

@Injectable()
export class CiudadesService {
  constructor(
    @InjectRepository(Ciudad)
    private ciudadRepository: Repository<Ciudad>,
    private departamentosService: DepartamentosService,
  ) {}

  async create(createCiudadDto: CreateCiudadDto): Promise<Ciudad> {
    await this.departamentosService.findOne(createCiudadDto.departamentoId);
    
    const ciudad = this.ciudadRepository.create(createCiudadDto);
    return this.ciudadRepository.save(ciudad);
  }

  async findAll(): Promise<Ciudad[]> {
    return this.ciudadRepository.find({ 
      relations: ['departamento'] 
    });
  }

  async findOne(id: number): Promise<Ciudad> {
    const ciudad = await this.ciudadRepository.findOne({ 
      where: { id },
      relations: ['departamento']
    });
    
    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada`);
    }
    
    return ciudad;
  }

  async findByDepartamento(departamentoId: number): Promise<Ciudad[]> {
    return this.ciudadRepository.find({
      where: { departamentoId },
      relations: ['departamento'],
    });
  }

  async update(id: number, updateCiudadDto: UpdateCiudadDto): Promise<Ciudad> {
    const ciudad = await this.findOne(id);
    
    if (updateCiudadDto.departamentoId) {
      await this.departamentosService.findOne(updateCiudadDto.departamentoId);
    }
    
    Object.assign(ciudad, updateCiudadDto);
    
    return this.ciudadRepository.save(ciudad);
  }

  async remove(id: number): Promise<void> {
    const ciudad = await this.findOne(id);
    await this.ciudadRepository.remove(ciudad);
  }
} 