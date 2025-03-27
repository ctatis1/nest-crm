import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCiudadDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El departamentoId es requerido' })
  @IsNumber({}, { message: 'El departamentoId debe ser un número' })
  departamentoId: number;
} 