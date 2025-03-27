import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioInfoDocument = UsuarioInfo & Document;

@Schema()
export class UsuarioInfo {
  @Prop({ required: true })
  userId: number;

  @Prop()
  imagenPerfil: string;

  @Prop()
  telefono: string;

  @Prop()
  direccion: string;

  @Prop()
  nombreUsuario: string;

  @Prop()
  cargo: string;

  @Prop({ type: Number })
  salario: number;

  @Prop({ type: Number })
  impuestosAnuales: number;
}

export const UsuarioInfoSchema = SchemaFactory.createForClass(UsuarioInfo); 