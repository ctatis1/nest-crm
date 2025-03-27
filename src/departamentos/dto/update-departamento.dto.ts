import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartamentoDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;
} 