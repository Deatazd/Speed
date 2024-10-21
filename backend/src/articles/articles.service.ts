// src/articles/articles.service.ts

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { ManageArticleDto } from './dto/manage-article.dto';
import { ArticleStatus } from './enums/article-status.enum';
import { SearchArticleDto } from './dto/search-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
      @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  // 创建新文章
  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
      const createdArticle = new this.articleModel(createArticleDto);
      createdArticle.status = ArticleStatus.Pending; // 设置初始状态为 pending
      try {
          return await createdArticle.save();
      } catch (error) {
          console.error('Error creating article:', error);
          throw new InternalServerErrorException('Failed to create article.');
      }
  }

  // 获取所有文章
  async findAll(): Promise<Article[]> {
      return this.articleModel.find().exec();
  }

  // 获取待审核文章
  async getPendingArticles(): Promise<Article[]> {
      return this.articleModel.find({ status: ArticleStatus.Pending }).exec();
  }

  // 获取已管理文章
  async getManagedArticles(): Promise<Article[]> {
      return this.articleModel.find({ status: ArticleStatus.Managed }).exec();
  }

  // 获取已批准的文章
  async getApprovedArticles(): Promise<Article[]> {
      return this.articleModel.find({ status: ArticleStatus.Approved }).exec();
  }

  // 管理文章
  async manageArticle(
      id: string,
      manageArticleDto: ManageArticleDto,
  ): Promise<Article | null> {
      const article = await this.articleModel.findById(id).exec();
      if (!article) {
          throw new NotFoundException(`Article with id ${id} not found`);
      }

      // 检查当前状态是否为 Pending
      if (article.status !== ArticleStatus.Pending) {
          throw new BadRequestException(`Article with id ${id} is not in a pending state`);
      }

      // 更新管理信息
      const { rating, seMethod, evidenceResult } = manageArticleDto;

      if (rating !== undefined && rating !== null) {
          article.ratings.push(rating);
          article.averageRating =
              article.ratings.reduce((a, b) => a + b, 0) / article.ratings.length;
      }

      if (seMethod) {
          article.seMethod = seMethod;
      }
      if (evidenceResult) {
          article.evidenceResult = evidenceResult;
      }

      // 更新状态为 Managed
      article.status = ArticleStatus.Managed;

      return article.save();
  }

  // 批准文章
  async approveArticle(id: string): Promise<Article | null> {
      const article = await this.articleModel.findById(id).exec();
      if (!article) {
          throw new NotFoundException(`Article with id ${id} not found`);
      }

      if (article.status !== ArticleStatus.Managed) {
          throw new BadRequestException(`Article with id ${id} is not in a managed state`);
      }

      article.status = ArticleStatus.Approved;
      return article.save();
  }

  // 拒绝文章
  async rejectArticle(id: string): Promise<Article | null> {
      const article = await this.articleModel.findById(id).exec();
      if (!article) {
          throw new NotFoundException(`Article with id ${id} not found`);
      }

      if (article.status !== ArticleStatus.Managed) {
          throw new BadRequestException(`Article with id ${id} is not in a managed state`);
      }

      article.status = ArticleStatus.Rejected;
      return article.save();
  }

  // 文章评级
  async rateArticle(id: string, rating: number): Promise<Article | null> {
      const article = await this.articleModel.findById(id).exec();
      if (!article) {
          throw new NotFoundException(`Article with id ${id} not found`);
      }
      article.ratings.push(rating);
      article.averageRating =
          article.ratings.reduce((a, b) => a + b, 0) / article.ratings.length;
      return article.save();
  }

  // 文章评论
  async commentArticle(id: string, comment: string): Promise<Article | null> {
      const article = await this.articleModel.findById(id).exec();
      if (!article) {
          throw new NotFoundException(`Article with id ${id} not found`);
      }
      article.comments.push(comment);
      return article.save();
  }

  // 提取文章信息
  async extractArticleInfo(
      id: string,
      extractedInfo: any, // 根据需要定义 ExtractInfoDto
  ): Promise<Article | null> {
      return this.articleModel
          .findByIdAndUpdate(id, extractedInfo, { new: true })
          .exec();
  }

  // 搜索文章
  async searchArticles(searchParams: SearchArticleDto): Promise<Article[]> {
      try {
          const filter: FilterQuery<ArticleDocument> = { status: ArticleStatus.Approved };

          if (searchParams.method) {
              filter.seMethod = { $regex: searchParams.method, $options: 'i' };
          }

          if (searchParams.claim) {
              filter.claim = { $regex: searchParams.claim, $options: 'i' };
          }

          if (searchParams.startYear || searchParams.endYear) {
              filter.pubyear = {};
              if (searchParams.startYear) {
                  filter.pubyear.$gte = searchParams.startYear;
              }
              if (searchParams.endYear) {
                  filter.pubyear.$lte = searchParams.endYear;
              }
          }

          if (searchParams.studyType) {
              filter.studyType = searchParams.studyType;
          }

          if (searchParams.evidenceResult) {
              filter.evidenceResult = searchParams.evidenceResult;
          }

          return this.articleModel.find(filter).exec();
      } catch (error) {
          console.error('Error searching articles:', error);
          throw new InternalServerErrorException('Failed to search articles.');
      }
  }
}
