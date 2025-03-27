import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ciudad } from './ciudad.entity';
import { Compania } from './compania.entity';


@Entity()
export class Departamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Ciudad, ciudad => ciudad.departamento)
  ciudades: Ciudad[];

  @OneToMany(() => Compania, compania => compania.departamento)
  companias: Compania[];
} 