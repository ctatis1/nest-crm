import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniasService } from './companias.service';
import { CompaniasController } from './companias.controller';
import { Compania } from '../entities/compania.entity';
import { CompaniaInfo, CompaniaInfoSchema } from '../schemas/compania-info.schema';
import { DepartamentosModule } from '../departamentos/departamentos.module';
import { CiudadesModule } from '../ciudades/ciudades.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compania]),
    MongooseModule.forFeature([
      { name: CompaniaInfo.name, schema: CompaniaInfoSchema },
    ]),
    DepartamentosModule,
    CiudadesModule,
  ],
  controllers: [CompaniasController],
  providers: [CompaniasService],
  exports: [CompaniasService],
})
export class CompaniasModule {} 