import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from '../entities/departamento.entity';
import { Ciudad } from '../entities/ciudad.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImportColombiaDataService {
  constructor(
    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>,
    @InjectRepository(Ciudad)
    private ciudadRepository: Repository<Ciudad>,
  ) {}

  async importData() {
    try {
      const jsonPath = path.resolve(__dirname, '../../colombia.min.json');
      const jsonContent = fs.readFileSync(jsonPath, 'utf8');
      const colombiaData = JSON.parse(jsonContent);

      for (const dept of colombiaData) {
        const departamento = await this.departamentoRepository.save({
          nombre: dept.departamento,
        });

        const ciudades = dept.ciudades.map(ciudad => ({
          nombre: ciudad,
          departamento: departamento,
        }));

        await this.ciudadRepository.save(ciudades);
        console.log(`Importado departamento ${dept.departamento} con ${dept.ciudades.length} ciudades`);
      }

      console.log('Importación completada exitosamente');
    } catch (error) {
      console.error('Error durante la importación:', error);
      throw error;
    }
  }
}
