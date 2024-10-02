import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../articles/schemas/article.schema';
export declare class AdminService {
    private articleModel;
    constructor(articleModel: Model<ArticleDocument>);
    getPendingArticles(): Promise<Article[]>;
    approveArticle(id: string): Promise<Article>;
    rejectArticle(id: string): Promise<Article>;
}
