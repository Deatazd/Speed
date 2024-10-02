import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  // 创建新文章
  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const newArticle = new this.articleModel(createArticleDto);
    return newArticle.save();
  }

  // 获取所有待审核的文章
  async getPendingArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'pending' }).exec();
  }

  // 搜索文章
  async searchArticles(searchParams: any): Promise<Article[]> {
    const query = {};
    if (searchParams.method) {
      query['seMethod'] = searchParams.method;
    }
    if (searchParams.claim) {
      query['claim'] = new RegExp(searchParams.claim, 'i');
    }
    if (searchParams.startYear && searchParams.endYear) {
      query['pubyear'] = {
        $gte: searchParams.startYear,
        $lte: searchParams.endYear,
      };
    }
    if (searchParams.studyType) {
      query['studyType'] = searchParams.studyType;
    }
    if (searchParams.evidenceResult) {
      query['evidenceResult'] = searchParams.evidenceResult;
    }

    return this.articleModel.find(query).exec();
  }

  // 提取关键信息
  async extractArticleInfo(id: string, extractedInfo: any): Promise<Article> {
    const { seMethod, studyType, evidenceResult } = extractedInfo;
    return this.articleModel
      .findByIdAndUpdate(
        id,
        { seMethod, studyType, evidenceResult },
        { new: true },
      )
      .exec();
  }

  // 批准文章
  async approveArticle(id: string): Promise<Article> {
    return this.articleModel
      .findByIdAndUpdate(id, { status: 'approved' }, { new: true })
      .exec();
  }

  // 拒绝文章
  async rejectArticle(id: string): Promise<Article> {
    return this.articleModel
      .findByIdAndUpdate(id, { status: 'rejected' }, { new: true })
      .exec();
  }

  // 文章评级
  async rateArticle(id: string, rating: number): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();

    if (!article.ratings) {
      article.ratings = [];
    }

    article.ratings.push(rating);
    const totalRatings = article.ratings.length;
    article.averageRating =
      article.ratings.reduce((a, b) => a + b, 0) / totalRatings;
    return article.save();
  }

  // 文章评论
  async commentArticle(id: string, comment: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();

    if (!article.comments) {
      article.comments = [];
    }

    article.comments.push(comment);
    return article.save();
  }
}
