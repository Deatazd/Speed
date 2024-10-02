import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
    @Prop({ required: true })
    title: string;

    // 将 authors 修改为数组类型
    @Prop({ type: [String], required: true })
    authors: string[];  // 这里使用字符串数组

    @Prop({ required: true })
    source: string;

    @Prop({ required: true })
    pubyear: number;

    @Prop({ required: true })
    doi: string;

    @Prop({ required: true })
    claim: string;

    @Prop({ required: true })
    evidence: string;

    @Prop({ required: true, default: 'pending' })
    status: string;

    @Prop({ type: [Number], default: [] })
    ratings: number[];

    @Prop({ default: 0 })
    averageRating: number;

    @Prop({ type: [String], default: [] })
    comments: string[];

    @Prop()
    seMethod: string;

    @Prop()
    studyType: string;

    @Prop()
    evidenceResult: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
