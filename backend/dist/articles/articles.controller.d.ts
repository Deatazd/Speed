import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ManageArticleDto } from './dto/manage-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { SearchArticleDto } from './dto/search-article.dto';
import { ExtractInfoDto } from './dto/extract-info.dto';
import { RateArticleDto } from './dto/rate-article.dto';
import { CommentArticleDto } from './dto/comment-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    createArticle(createArticleDto: CreateArticleDto): Promise<ArticleResponseDto>;
    findAll(): Promise<ArticleResponseDto[]>;
    getPendingArticles(): Promise<ArticleResponseDto[]>;
    getManagedArticles(): Promise<ArticleResponseDto[]>;
    getApprovedArticles(): Promise<ArticleResponseDto[]>;
    extractArticleInfo(id: string, extractedInfo: ExtractInfoDto): Promise<ArticleResponseDto>;
    searchArticles(searchParams: SearchArticleDto): Promise<ArticleResponseDto[]>;
    rateArticle(id: string, rateArticleDto: RateArticleDto): Promise<ArticleResponseDto>;
    commentArticle(id: string, commentArticleDto: CommentArticleDto): Promise<ArticleResponseDto>;
    manageArticle(id: string, manageArticleDto: ManageArticleDto): Promise<ArticleResponseDto>;
    approveArticle(id: string): Promise<ArticleResponseDto>;
    rejectArticle(id: string): Promise<ArticleResponseDto>;
    private transformToResponseDto;
}
