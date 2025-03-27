import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartamentoDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;
} 