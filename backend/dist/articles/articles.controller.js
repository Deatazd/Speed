"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const articles_service_1 = require("./articles.service");
const create_article_dto_1 = require("./dto/create-article.dto");
const search_article_dto_1 = require("./dto/search-article.dto");
const extract_info_dto_1 = require("./dto/extract-info.dto");
let ArticlesController = class ArticlesController {
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    async createArticle(createArticleDto) {
        const article = await this.articlesService.createArticle(createArticleDto);
        return this.transformToResponseDto(article);
    }
    async getPendingArticles() {
        const articles = await this.articlesService.getPendingArticles();
        return articles.map((article) => this.transformToResponseDto(article));
    }
    async getApprovedArticles() {
        const articles = await this.articlesService.getApprovedArticles();
        return articles.map((article) => this.transformToResponseDto(article));
    }
    async getManagedArticles() {
        const articles = await this.articlesService.getManagedArticles();
        return articles.map((article) => this.transformToResponseDto(article));
    }
    async findAll() {
        const articles = await this.articlesService.findAll();
        return articles.map((article) => this.transformToResponseDto(article));
    }
    async extractArticleInfo(id, extractedInfo) {
        const updatedArticle = await this.articlesService.extractArticleInfo(id, extractedInfo);
        if (!updatedArticle) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(updatedArticle);
    }
    async searchArticles(searchParams) {
        const articles = await this.articlesService.searchArticles(searchParams);
        return articles.map((article) => this.transformToResponseDto(article));
    }
    async rateArticle(id, rateArticleDto) {
        const ratedArticle = await this.articlesService.rateArticle(id, rateArticleDto.rating);
        if (!ratedArticle) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(ratedArticle);
    }
    async commentArticle(id, commentArticleDto) {
        const commentedArticle = await this.articlesService.commentArticle(id, commentArticleDto.comment);
        if (!commentedArticle) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(commentedArticle);
    }
    async manageArticle(id, manageArticleDto) {
        const managedArticle = await this.articlesService.manageArticle(id, manageArticleDto);
        if (!managedArticle) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(managedArticle);
    }
    async approveArticle(id) {
        const approvedArticle = await this.articlesService.approveArticle(id);
        if (!approvedArticle) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        return this.transformToResponseDto(approvedArticle);
    }
    async rejectArticle(id) {
        const deleted = await this.articlesService.rejectArticle(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        return { message: `Article with id ${id} has been rejected and deleted.` };
    }
    transformToResponseDto(article) {
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
};
exports.ArticlesController = ArticlesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Get)('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getPendingArticles", null);
__decorate([
    (0, common_1.Get)('approved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getApprovedArticles", null);
__decorate([
    (0, common_1.Get)('view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getManagedArticles", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('extract-info/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, extract_info_dto_1.ExtractInfoDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "extractArticleInfo", null);
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_article_dto_1.SearchArticleDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "searchArticles", null);
__decorate([
    (0, common_1.Post)('rate/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "rateArticle", null);
__decorate([
    (0, common_1.Post)('comment/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "commentArticle", null);
__decorate([
    (0, common_1.Post)('manage/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "manageArticle", null);
__decorate([
    (0, common_1.Post)('approve/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "approveArticle", null);
__decorate([
    (0, common_1.Post)('reject/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "rejectArticle", null);
exports.ArticlesController = ArticlesController = __decorate([
    (0, common_1.Controller)('articles'),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
//# sourceMappingURL=articles.controller.js.map