import { IsEmail, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El ID de la compañía es requerido' })
  @IsNumber({}, { message: 'El ID de la compañía debe ser un número' })
  companyId: number;
} 