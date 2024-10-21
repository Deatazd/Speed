// src/articles/schemas/article.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ArticleStatus } from '../enums/article-status.enum';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, type: [String] })
    authors: string[];

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

    @Prop({ required: true, enum: ArticleStatus, default: ArticleStatus.Pending })
    status: ArticleStatus;

    @Prop({ type: [Number], default: [] })
    ratings: number[];

    @Prop({ default: 0 })
    averageRating: number;

    @Prop({ type: [String], default: [] })
    comments: string[];

    @Prop({ required: true })
    seMethod: string;

    @Prop({ required: true })
    studyType: string;

    @Prop({ required: true })
    evidenceResult: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
