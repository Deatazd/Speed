// src/articles/articles.controller.ts

import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Body,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ManageArticleDto } from './dto/manage-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { SearchArticleDto } from './dto/search-article.dto';
import { ExtractInfoDto } from './dto/extract-info.dto';
import { RateArticleDto } from './dto/rate-article.dto';
import { CommentArticleDto } from './dto/comment-article.dto';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    // 创建新文章
    @Post()
    async createArticle(
        @Body() createArticleDto: CreateArticleDto,
    ): Promise<ArticleResponseDto> {
        const article = await this.articlesService.createArticle(createArticleDto);
        return this.transformToResponseDto(article);
    }

    // 获取所有文章
    @Get()
    async findAll(): Promise<ArticleResponseDto[]> {
        const articles = await this.articlesService.findAll();
        return articles.map((article) => this.transformToResponseDto(article));
    }

    // 获取待审核文章
    @Get('pending')
    async getPendingArticles(): Promise<ArticleResponseDto[]> {
        const articles = await this.articlesService.getPendingArticles();
        return articles.map((article) => this.transformToResponseDto(article));
    }

    // 获取已管理文章
    @Get('managed')
    async getManagedArticles(): Promise<ArticleResponseDto[]> {
        const articles = await this.articlesService.getManagedArticles();
        return articles.map((article) => this.transformToResponseDto(article));
    }

    // 获取已批准的文章
    @Get('approved')
    async getApprovedArticles(): Promise<ArticleResponseDto[]> {
        const articles = await this.articlesService.getApprovedArticles();
        return articles.map((article) => this.transformToResponseDto(article));
    }

    // 提取文章信息
    @Post('extract-info/:id')
    async extractArticleInfo(
        @Param('id') id: string,
        @Body() extractedInfo: ExtractInfoDto,
    ): Promise<ArticleResponseDto> {
        const updatedArticle = await this.articlesService.extractArticleInfo(
            id,
            extractedInfo,
        );
        if (!updatedArticle) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(updatedArticle);
    }

    // 搜索文章
    @Post('search')
    async searchArticles(
        @Body() searchParams: SearchArticleDto,
    ): Promise<ArticleResponseDto[]> {
        const articles = await this.articlesService.searchArticles(searchParams);
        return articles.map((article) => this.transformToResponseDto(article));
    }

    // 文章评级
    @Post('rate/:id')
    async rateArticle(
        @Param('id') id: string,
        @Body() rateArticleDto: RateArticleDto,
    ): Promise<ArticleResponseDto> {
        const ratedArticle = await this.articlesService.rateArticle(
            id,
            rateArticleDto.rating,
        );
        if (!ratedArticle) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(ratedArticle);
    }

    // 文章评论
    @Post('comment/:id')
    async commentArticle(
        @Param('id') id: string,
        @Body() commentArticleDto: CommentArticleDto,
    ): Promise<ArticleResponseDto> {
        const commentedArticle = await this.articlesService.commentArticle(
            id,
            commentArticleDto.comment,
        );
        if (!commentedArticle) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(commentedArticle);
    }

    // 管理文章
    @Post('manage/:id')
    async manageArticle(
        @Param('id') id: string,
        @Body() manageArticleDto: ManageArticleDto,
    ): Promise<ArticleResponseDto> {
        const managedArticle = await this.articlesService.manageArticle(
            id,
            manageArticleDto,
        );
        if (!managedArticle) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(managedArticle);
    }

    // 批准文章
    @Put('approve/:id')
    async approveArticle(@Param('id') id: string): Promise<ArticleResponseDto> {
        const approvedArticle = await this.articlesService.approveArticle(id);
        if (!approvedArticle) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(approvedArticle);
    }

    // 拒绝文章
    @Put('reject/:id')
    async rejectArticle(@Param('id') id: string): Promise<ArticleResponseDto> {
        const rejectedArticle = await this.articlesService.rejectArticle(id);
        if (!rejectedArticle) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(rejectedArticle);
    }

    // 转换为响应 DTO
    private transformToResponseDto(article: any): ArticleResponseDto {
        return {
            id: article._id.toString(),
            title: article.title,
            authors: article.authors,
            source: article.source,
            pubyear: article.pubyear,
            doi: article.doi,
            claim: article.claim,
            evidence: article.evidence,
            status: article.status,
            ratings: article.ratings,
            averageRating: article.averageRating,
            comments: article.comments,
            seMethod: article.seMethod,
            studyType: article.studyType,
            evidenceResult: article.evidenceResult,
        };
    }
}
