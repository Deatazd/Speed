import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../articles/schemas/article.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  // 获取所有待审核的文章
  async getPendingArticles(): Promise<Article[]> {
    return this.articleModel.find({ status: 'pending' }).exec();
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
}
