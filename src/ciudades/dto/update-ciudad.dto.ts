import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCiudadDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El departamentoId debe ser un número' })
  departamentoId?: number;
} 