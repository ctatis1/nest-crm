import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportColombiaDataService } from './import-colombia-data';
import { Departamento } from '../entities/departamento.entity';
import { Ciudad } from '../entities/ciudad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Departamento, Ciudad]),
  ],
  providers: [ImportColombiaDataService],
})
export class ScriptsModule {}
