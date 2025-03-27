import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from '../entities/producto.entity';
import { ProductoInfo, ProductoInfoSchema } from '../schemas/producto-info.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    MongooseModule.forFeature([
      { name: ProductoInfo.name, schema: ProductoInfoSchema },
    ]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {} 