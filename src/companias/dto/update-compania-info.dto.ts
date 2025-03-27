import { IsOptional, IsString } from 'class-validator';

export class UpdateCompaniaInfoDto {
  @IsOptional()
  @IsString({ message: 'La URL del logo debe ser un texto' })
  logoUrl?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  direccion?: string;

  @IsOptional()
  @IsString({ message: 'La actividad económica debe ser un texto' })
  actividadEconomica?: string;

  @IsOptional()
  @IsString({ message: 'El código de actividad económica debe ser un texto' })
  codigoActividadEconomica?: string;
} 