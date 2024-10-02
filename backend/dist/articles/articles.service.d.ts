import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { SearchArticleDto } from './dto/search-article.dto';
import { ExtractInfoDto } from './dto/extract-info.dto';
import { ManageArticleDto } from './dto/manage-article.dto';
export declare class ArticlesService {
    private articleModel;
    constructor(articleModel: Model<ArticleDocument>);
    createArticle(createArticleDto: CreateArticleDto): Promise<Article>;
    getPendingArticles(): Promise<Article[]>;
    getManagedArticles(): Promise<Article[]>;
    getApprovedArticles(): Promise<Article[]>;
    findAll(): Promise<Article[]>;
    extractArticleInfo(id: string, extractedInfo: ExtractInfoDto): Promise<Article | null>;
    searchArticles(searchParams: SearchArticleDto): Promise<Article[]>;
    rateArticle(id: string, rating: number): Promise<Article | null>;
    commentArticle(id: string, comment: string): Promise<Article | null>;
    manageArticle(id: string, manageArticleDto: ManageArticleDto): Promise<Article | null>;
    approveArticle(id: string): Promise<Article | null>;
    rejectArticle(id: string): Promise<boolean>;
}
