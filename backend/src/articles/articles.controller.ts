// src/articles/articles.controller.ts

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { SearchArticleDto } from './dto/search-article.dto';
import { ExtractInfoDto } from './dto/extract-info.dto';
import type { RateArticleDto } from './dto/rate-article.dto';
import type { CommentArticleDto } from './dto/comment-article.dto';
import type { ManageArticleDto } from './dto/manage-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.articlesService.createArticle(createArticleDto);
    return this.transformToResponseDto(article);
  }

  @Get('pending')
  async getPendingArticles(): Promise<ArticleResponseDto[]> {
    const articles = await this.articlesService.getPendingArticles();
    return articles.map((article) => this.transformToResponseDto(article));
  }

  @Get('approved')
  async getApprovedArticles(): Promise<ArticleResponseDto[]> {
    const articles = await this.articlesService.getApprovedArticles();
    return articles.map((article) => this.transformToResponseDto(article));
  }

  @Get('view')
  async getManagedArticles(): Promise<ArticleResponseDto[]> {
    const articles = await this.articlesService.getManagedArticles();
    return articles.map((article) => this.transformToResponseDto(article));
  }

  @Get()
  async findAll(): Promise<ArticleResponseDto[]> {
    const articles = await this.articlesService.findAll();
    return articles.map((article) => this.transformToResponseDto(article));
  }

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

  @Post('search')
  async searchArticles(
    @Body() searchParams: SearchArticleDto,
  ): Promise<ArticleResponseDto[]> {
    const articles = await this.articlesService.searchArticles(searchParams);
    return articles.map((article) => this.transformToResponseDto(article));
  }

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

  @Post('approve/:id')
  async approveArticle(@Param('id') id: string): Promise<ArticleResponseDto> {
    const approvedArticle = await this.articlesService.approveArticle(id);
    if (!approvedArticle) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return this.transformToResponseDto(approvedArticle);
  }

  @Post('reject/:id')
  async rejectArticle(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.articlesService.rejectArticle(id);
    if (!deleted) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return { message: `Article with id ${id} has been rejected and deleted.` };
  }

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
