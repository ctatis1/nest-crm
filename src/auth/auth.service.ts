import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { Compania } from '../entities/compania.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Compania)
    private companiaRepository: Repository<Compania>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      console.log('Intento de login para email:', email);
      
      const usuario = await this.usuarioRepository.findOne({ where: { email } });
      if (!usuario) {
        console.log('Usuario no encontrado');
        throw new UnauthorizedException('Usuario no registrado');
      }

      console.log('Usuario encontrado, comparando contraseñas');

      const isPasswordValid = await bcrypt.compare(password, usuario.password);
      console.log('Resultado de la comparación:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Contraseña inválida');
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const payload = { sub: usuario.id, email: usuario.email };
      
      return {
        accessToken: this.jwtService.sign(payload),
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async signup(signupDto: SignupDto) {
    try {
      const { email, companyId } = signupDto;
      console.log('Iniciando registro para email:', email);
            
      const existingUser = await this.usuarioRepository.findOne({ where: { email } });
      if (existingUser) {
        console.log('Usuario ya existe');
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      
      const compania = await this.companiaRepository.findOne({ where: { id: companyId } });
      if (!compania) {
        console.log('Compañía no encontrada');
        throw new BadRequestException('La compañía especificada no existe');
      }

      const usuario = this.usuarioRepository.create(signupDto);

      await this.usuarioRepository.save(usuario);
      console.log('Usuario creado exitosamente');

      const payload = { sub: usuario.id, email: usuario.email };
      return {
        accessToken: this.jwtService.sign(payload),
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      };
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }
} 