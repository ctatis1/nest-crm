import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Compania } from './compania.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column()
  companyId: number;

  @ManyToOne(() => Compania, compania => compania.productos)
  compania: Compania;
} 