import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string[];

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  pubyear: number;

  @Prop()
  doi?: string;

  @Prop({ required: true })
  claim: string;

  @Prop({ required: true })
  evidence: string;

  @Prop({ default: 'pending' })
  status: string; // pending, approved, rejected

  @Prop({ default: [] })
  ratings: number[];

  @Prop({ default: [] })
  comments: string[];

  @Prop({ default: 0 })
  averageRating: number;

  @Prop()
  seMethod?: string; // SE 方法

  @Prop()
  studyType?: string; // 研究类型

  @Prop()
  evidenceResult?: string; // 证据结果
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
