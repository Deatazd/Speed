import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    createArticle(createArticleDto: CreateArticleDto): Promise<import("./schemas/article.schema").Article>;
    getPendingArticles(): Promise<import("./schemas/article.schema").Article[]>;
    extractArticleInfo(id: string, extractedInfo: any): Promise<import("./schemas/article.schema").Article>;
    searchArticles(searchParams: any): Promise<import("./schemas/article.schema").Article[]>;
    rateArticle(id: string, rating: {
        rating: number;
    }): Promise<import("./schemas/article.schema").Article>;
    commentArticle(id: string, comment: {
        comment: string;
    }): Promise<import("./schemas/article.schema").Article>;
}
