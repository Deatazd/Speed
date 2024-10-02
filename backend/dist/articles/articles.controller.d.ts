import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { SearchArticleDto } from './dto/search-article.dto';
import { ExtractInfoDto } from './dto/extract-info.dto';
import type { RateArticleDto } from './dto/rate-article.dto';
import type { CommentArticleDto } from './dto/comment-article.dto';
import type { ManageArticleDto } from './dto/manage-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    createArticle(createArticleDto: CreateArticleDto): Promise<ArticleResponseDto>;
    getPendingArticles(): Promise<ArticleResponseDto[]>;
    getApprovedArticles(): Promise<ArticleResponseDto[]>;
    getManagedArticles(): Promise<ArticleResponseDto[]>;
    findAll(): Promise<ArticleResponseDto[]>;
    extractArticleInfo(id: string, extractedInfo: ExtractInfoDto): Promise<ArticleResponseDto>;
    searchArticles(searchParams: SearchArticleDto): Promise<ArticleResponseDto[]>;
    rateArticle(id: string, rateArticleDto: RateArticleDto): Promise<ArticleResponseDto>;
    commentArticle(id: string, commentArticleDto: CommentArticleDto): Promise<ArticleResponseDto>;
    manageArticle(id: string, manageArticleDto: ManageArticleDto): Promise<ArticleResponseDto>;
    approveArticle(id: string): Promise<ArticleResponseDto>;
    rejectArticle(id: string): Promise<{
        message: string;
    }>;
    private transformToResponseDto;
}
