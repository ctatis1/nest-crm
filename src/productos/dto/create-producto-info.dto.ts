import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, Min } from 'class-validator';

export class CreateProductoInfoDto {
  @IsNotEmpty({ message: 'El productoId es requerido' })
  @IsNumber({}, { message: 'El productoId debe ser un número' })
  productoId: number;

  @IsOptional()
  @IsArray({ message: 'Las URLs de imágenes deben ser un array' })
  @IsString({ each: true, message: 'Cada URL debe ser un texto' })
  imagenesUrls?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0, { message: 'La cantidad debe ser mayor o igual a cero' })
  cantidad?: number;

  @IsOptional()
  @IsString({ message: 'La categoría debe ser un texto' })
  categoria?: string;

  @IsOptional()
  @IsString({ message: 'La subcategoría debe ser un texto' })
  subCategoria?: string;
} 