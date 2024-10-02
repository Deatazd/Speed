import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // 创建文章
  @Post()
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.createArticle(createArticleDto);
  }

  // 获取所有待审核文章
  @Get('pending')
  async getPendingArticles() {
    return this.articlesService.getPendingArticles();
  }

  // 提取关键信息
  @Post('extract-info/:id')
  async extractArticleInfo(
    @Param('id') id: string,
    @Body() extractedInfo: any,
  ) {
    return this.articlesService.extractArticleInfo(id, extractedInfo);
  }

  // 搜索文章
  @Post('search')
  async searchArticles(@Body() searchParams: any) {
    return this.articlesService.searchArticles(searchParams);
  }

  // 评级
  @Post('rate/:id')
  async rateArticle(
    @Param('id') id: string,
    @Body() rating: { rating: number },
  ) {
    return this.articlesService.rateArticle(id, rating.rating);
  }

  // 评论
  @Post('comment/:id')
  async commentArticle(
    @Param('id') id: string,
    @Body() comment: { comment: string },
  ) {
    return this.articlesService.commentArticle(id, comment.comment);
  }
}
