import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCompaniaDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  direccion?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ciudadId debe ser un número' })
  ciudadId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El departamentoId debe ser un número' })
  departamentoId?: number;
} 