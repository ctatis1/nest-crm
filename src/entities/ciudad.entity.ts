import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Departamento } from './departamento.entity';
import { Compania } from './compania.entity';

@Entity()
export class Ciudad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  departamentoId: number;

  @ManyToOne(() => Departamento, departamento => departamento.ciudades)
  departamento: Departamento;

  @OneToMany(() => Compania, compania => compania.ciudad)
  companias: Compania[];
} 