import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Departamento } from './departamento.entity';
import { Ciudad } from './ciudad.entity';
import { Usuario } from './usuario.entity';
import { Producto } from './producto.entity';

@Entity()
export class Compania {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  ciudadId: number;

  @Column()
  departamentoId: number;

  @ManyToOne(() => Ciudad, ciudad => ciudad.companias)
  ciudad: Ciudad;

  @ManyToOne(() => Departamento, departamento => departamento.companias)
  departamento: Departamento;

  @OneToMany(() => Usuario, usuario => usuario.compania)
  usuarios: Usuario[];

  @OneToMany(() => Producto, producto => producto.compania)
  productos: Producto[];
} 