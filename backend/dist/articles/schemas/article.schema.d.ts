import { Document } from 'mongoose';
import { ArticleStatus } from '../enums/article-status.enum';
export type ArticleDocument = Article & Document;
export declare class Article {
    title: string;
    authors: string[];
    source: string;
    pubyear: number;
    doi: string;
    claim: string;
    evidence: string;
    status: ArticleStatus;
    ratings: number[];
    averageRating: number;
    comments: string[];
    seMethod: string;
    studyType: string;
    evidenceResult: string;
}
export declare const ArticleSchema: import("mongoose").Schema<Article, import("mongoose").Model<Article, any, any, any, Document<unknown, any, Article> & Article & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Article, Document<unknown, {}, import("mongoose").FlatRecord<Article>> & import("mongoose").FlatRecord<Article> & {
    _id: import("mongoose").Types.ObjectId;
}>;
