import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompaniaInfoDocument = CompaniaInfo & Document;

@Schema()
export class CompaniaInfo {
  _id?: any;

  @Prop({ required: true })
  companiaId: number;

  @Prop()
  logoUrl: string;

  @Prop()
  telefono: string;

  @Prop()
  direccion: string;

  @Prop()
  actividadEconomica: string;

  @Prop()
  codigoActividadEconomica: string;
}

export const CompaniaInfoSchema = SchemaFactory.createForClass(CompaniaInfo); 