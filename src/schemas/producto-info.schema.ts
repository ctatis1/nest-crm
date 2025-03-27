import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductoInfoDocument = ProductoInfo & Document;

@Schema()
export class ProductoInfo {
  @Prop({ required: true })
  productoId: number;

  @Prop({ type: [String] })
  imagenesUrls: string[];

  @Prop({ type: Number })
  cantidad: number;

  @Prop()
  categoria: string;

  @Prop()
  subCategoria: string;
}

export const ProductoInfoSchema = SchemaFactory.createForClass(ProductoInfo); 