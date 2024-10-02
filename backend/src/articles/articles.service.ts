// src/articles/articles.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { SearchArticleDto } from './dto/search-article.dto';
import { ExtractInfoDto } from './dto/extract-info.dto';
import { RateArticleDto } from './dto/rate-article.dto';
import { CommentArticleDto } from './dto/comment-article.dto';
import { ManageArticleDto } from './dto/manage-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  // 创建新文章
  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    createdArticle.status = 'pending'; // 确保文章默认处于待审核状态
    return createdArticle.save();
  }

  // 获取待审核文章
  async getPendingArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'pending' }).exec();
  }

  // 获取已管理文章
  async getManagedArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'managed' }).exec();
  }

  // 获取已批准的文章
  async getApprovedArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'approved' }).exec();
  }

  // 获取所有文章
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  // 提取文章信息
  async extractArticleInfo(
    id: string,
    extractedInfo: ExtractInfoDto,
  ): Promise<Article | null> {
    return this.articleModel
      .findByIdAndUpdate(id, extractedInfo, { new: true })
      .exec();
  }

  // 搜索文章
  async searchArticles(searchParams: SearchArticleDto): Promise<Article[]> {
    const query: any = {};

    if (searchParams.method) {
      query.seMethod = { $regex: searchParams.method, $options: 'i' };
    }
    if (searchParams.claim) {
      query.claim = { $regex: searchParams.claim, $options: 'i' };
    }
    if (searchParams.startYear && searchParams.endYear) {
      query.pubyear = { $gte: searchParams.startYear, $lte: searchParams.endYear };
    } else if (searchParams.startYear) {
      query.pubyear = { $gte: searchParams.startYear };
    } else if (searchParams.endYear) {
      query.pubyear = { $lte: searchParams.endYear };
    }
    if (searchParams.studyType) {
      query.studyType = searchParams.studyType;
    }
    if (searchParams.evidenceResult) {
      query.evidenceResult = searchParams.evidenceResult;
    }

    return this.articleModel.find(query).exec();
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

  // 管理文章
  async manageArticle(
    id: string,
    manageArticleDto: ManageArticleDto,
  ): Promise<Article | null> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    const { rating, seMethod, studyType, evidenceResult } = manageArticleDto;

    if (rating) {
      article.ratings.push(rating);
      article.averageRating =
        article.ratings.reduce((a, b) => a + b, 0) / article.ratings.length;
    }

    if (seMethod) {
      article.seMethod = seMethod;
    }
    if (studyType) {
      article.studyType = studyType;
    }
    if (evidenceResult) {
      article.evidenceResult = evidenceResult;
    }

    article.status = 'managed';

    return article.save();
  }

  // 批准文章
  async approveArticle(id: string): Promise<Article | null> {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, { status: 'approved' }, { new: true })
      .exec();
    if (!updatedArticle) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return updatedArticle;
  }

  // 拒绝文章并删除
  async rejectArticle(id: string): Promise<boolean> {
    const deleted = await this.articleModel.findByIdAndDelete(id).exec();
    return !!deleted;
  }
}
