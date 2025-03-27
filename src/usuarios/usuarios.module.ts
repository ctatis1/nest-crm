import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioInfo, UsuarioInfoSchema } from '../schemas/usuario-info.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    MongooseModule.forFeature([
      { name: UsuarioInfo.name, schema: UsuarioInfoSchema },
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {} 