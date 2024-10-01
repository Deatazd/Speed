import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: [String] })
  authors: string[];

  @Prop({ required: true })
  source: string;

  @Prop() // pubyear 是可选的
  pubyear: number;

  @Prop()
  doi: string;

  @Prop({ required: true })
  claim: string;

  @Prop({ required: true })
  evidence: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
