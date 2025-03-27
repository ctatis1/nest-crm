import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class UpdateProductoDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio debe ser mayor o igual a cero' })
  precio?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID de la compañía debe ser un número' })
  companyId?: number;
} 