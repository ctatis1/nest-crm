import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto } from '../entities/producto.entity';
import { ProductoInfo, ProductoInfoDocument } from '../schemas/producto-info.schema';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateProductoInfoDto } from './dto/create-producto-info.dto';
import { UpdateProductoInfoDto } from './dto/update-producto-info.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectModel(ProductoInfo.name)
    private productoInfoModel: Model<ProductoInfoDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      console.log('Iniciando creación de producto:', createProductoDto);
      
      console.log('Creando entidad de producto');
      const producto = this.productoRepository.create(createProductoDto);
      
      console.log('Guardando producto en la base de datos');
      const savedProducto = await this.productoRepository.save(producto);
      
      console.log('Producto creado exitosamente:', savedProducto);
      this.eventEmitter.emit('product.created', savedProducto);
      
      return savedProducto;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  async findAll(): Promise<Producto[]> {
    try {
      console.log('Buscando todos los productos');
      const productos = await this.productoRepository.find({
        relations: ['compania'],
      });
      console.log(`Se encontraron ${productos.length} productos`);
      return productos;
    } catch (error) {
      console.error('Error al buscar todos los productos:', error);
      throw error;
    }
  }

  async findByCompania(companyId: number): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { companyId },
      relations: ['compania'],
    });
  }

  async findOne(id: number): Promise<Producto> {
    try {
      console.log(`Buscando producto con ID: ${id}`);
      const producto = await this.productoRepository.findOne({
        where: { id },
        relations: ['compania'],
      });
      
      if (!producto) {
        console.log(`Producto con ID ${id} no encontrado`);
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      
      console.log('Producto encontrado:', producto);
      return producto;
    } catch (error) {
      console.error(`Error al buscar producto con ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    try {
      console.log(`Iniciando actualización de producto con ID: ${id}`);
      console.log('Datos a actualizar:', updateProductoDto);
      
      const producto = await this.findOne(id);
      
      console.log('Actualizando datos del producto');
      Object.assign(producto, updateProductoDto);
      
      console.log('Guardando cambios en la base de datos');
      const updatedProducto = await this.productoRepository.save(producto);
      console.log('Producto actualizado exitosamente:', updatedProducto);
      
      this.eventEmitter.emit('product.updated', updatedProducto);
      
      return updatedProducto;
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    
    await this.productoInfoModel.deleteOne({ productoId: id }).exec();
  }

  // Métodos para la información adicional en MongoDB
  async createInfo(createProductoInfoDto: CreateProductoInfoDto): Promise<ProductoInfo> {
    try {
      console.log('Iniciando creación de información adicional de producto');
      console.log('Datos:', createProductoInfoDto);
      
      await this.findOne(createProductoInfoDto.productoId);
      
      const info = new this.productoInfoModel(createProductoInfoDto);
      const savedInfo = await info.save();
      
      console.log('Información adicional creada exitosamente:', savedInfo);
      return savedInfo;
    } catch (error) {
      console.error('Error al crear información adicional de producto:', error);
      throw error;
    }
  }

  async findInfoByProductoId(productoId: number): Promise<ProductoInfo> {
    try {
      console.log(`Buscando información adicional para producto ID: ${productoId}`);
      const info = await this.productoInfoModel.findOne({ productoId }).exec();
      
      if (!info) {
        console.log(`Información adicional para producto ${productoId} no encontrada`);
        throw new NotFoundException(`Información adicional para producto con ID ${productoId} no encontrada`);
      }
      
      console.log('Información adicional encontrada:', info);
      return info;
    } catch (error) {
      console.error(`Error al buscar información adicional de producto ${productoId}:`, error);
      throw error;
    }
  }

  async updateInfo(productoId: number, updateProductoInfoDto: UpdateProductoInfoDto): Promise<ProductoInfo> {
    try {
      console.log(`Iniciando actualización de información adicional para producto ID: ${productoId}`);
      console.log('Datos a actualizar:', updateProductoInfoDto);
      
      const info = await this.findInfoByProductoId(productoId);
      
      Object.assign(info, updateProductoInfoDto);
      const updatedInfo = await (info as ProductoInfoDocument).save();
      
      console.log('Información adicional actualizada exitosamente:', updatedInfo);
      return updatedInfo;
    } catch (error) {
      console.error(`Error al actualizar información adicional de producto ${productoId}:`, error);
      throw error;
    }
  }
} 