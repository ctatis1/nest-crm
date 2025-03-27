import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUsuarioInfoDto {
  @IsNotEmpty({ message: 'El userId es requerido' })
  @IsNumber({}, { message: 'El userId debe ser un número' })
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsString({ message: 'La URL de la imagen de perfil debe ser un texto' })
  imagenPerfil?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  direccion?: string;

  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  nombreUsuario?: string;

  @IsOptional()
  @IsString({ message: 'El cargo debe ser un texto' })
  cargo?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El salario debe ser un número' })
  @Type(() => Number)
  salario?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Los impuestos anuales deben ser un número' })
  @Type(() => Number)
  impuestosAnuales?: number;
} 