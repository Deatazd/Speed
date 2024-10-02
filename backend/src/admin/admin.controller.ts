import { Controller, Get, Post, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 获取待审核的文章
  @Get('pending-articles')
  async getPendingArticles() {
    return this.adminService.getPendingArticles();
  }

  // 批准文章
  @Post('approve/:id')
  async approveArticle(@Param('id') id: string) {
    return this.adminService.approveArticle(id);
  }

  // 拒绝文章
  @Post('reject/:id')
  async rejectArticle(@Param('id') id: string) {
    return this.adminService.rejectArticle(id);
  }
}
