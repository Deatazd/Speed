import { Model } from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article, ArticleDocument } from './schemas/article.schema';
export declare class ArticlesService {
    private articleModel;
    constructor(articleModel: Model<ArticleDocument>);
    createArticle(createArticleDto: CreateArticleDto): Promise<Article>;
    getPendingArticles(): Promise<Article[]>;
    searchArticles(searchParams: any): Promise<Article[]>;
    extractArticleInfo(id: string, extractedInfo: any): Promise<Article>;
    approveArticle(id: string): Promise<Article>;
    rejectArticle(id: string): Promise<Article>;
    rateArticle(id: string, rating: number): Promise<Article>;
    commentArticle(id: string, comment: string): Promise<Article>;
}
