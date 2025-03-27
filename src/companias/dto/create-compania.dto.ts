import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCompaniaDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;

  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString({ message: 'La dirección debe ser un texto' })
  direccion: string;

  @IsNotEmpty({ message: 'El ciudadId es requerido' })
  @IsNumber({}, { message: 'El ciudadId debe ser un número' })
  ciudadId: number;

  @IsNotEmpty({ message: 'El departamentoId es requerido' })
  @IsNumber({}, { message: 'El departamentoId debe ser un número' })
  departamentoId: number;
} 