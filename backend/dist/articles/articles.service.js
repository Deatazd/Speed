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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const article_schema_1 = require("./schemas/article.schema");
const article_status_enum_1 = require("./enums/article-status.enum");
let ArticlesService = class ArticlesService {
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async createArticle(createArticleDto) {
        const createdArticle = new this.articleModel(createArticleDto);
        createdArticle.status = article_status_enum_1.ArticleStatus.Pending;
        try {
            return await createdArticle.save();
        }
        catch (error) {
            console.error('Error creating article:', error);
            throw new common_1.InternalServerErrorException('Failed to create article.');
        }
    }
    async findAll() {
        return this.articleModel.find().exec();
    }
    async getPendingArticles() {
        return this.articleModel.find({ status: article_status_enum_1.ArticleStatus.Pending }).exec();
    }
    async getManagedArticles() {
        return this.articleModel.find({ status: article_status_enum_1.ArticleStatus.Managed }).exec();
    }
    async getApprovedArticles() {
        return this.articleModel.find({ status: article_status_enum_1.ArticleStatus.Approved }).exec();
    }
    async manageArticle(id, manageArticleDto) {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        if (article.status !== article_status_enum_1.ArticleStatus.Pending) {
            throw new common_1.BadRequestException(`Article with id ${id} is not in a pending state`);
        }
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
        article.status = article_status_enum_1.ArticleStatus.Managed;
        return article.save();
    }
    async approveArticle(id) {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        if (article.status !== article_status_enum_1.ArticleStatus.Managed) {
            throw new common_1.BadRequestException(`Article with id ${id} is not in a managed state`);
        }
        article.status = article_status_enum_1.ArticleStatus.Approved;
        return article.save();
    }
    async rejectArticle(id) {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        if (article.status !== article_status_enum_1.ArticleStatus.Managed) {
            throw new common_1.BadRequestException(`Article with id ${id} is not in a managed state`);
        }
        article.status = article_status_enum_1.ArticleStatus.Rejected;
        return article.save();
    }
    async rateArticle(id, rating) {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        article.ratings.push(rating);
        article.averageRating =
            article.ratings.reduce((a, b) => a + b, 0) / article.ratings.length;
        return article.save();
    }
    async commentArticle(id, comment) {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        article.comments.push(comment);
        return article.save();
    }
    async extractArticleInfo(id, extractedInfo) {
        return this.articleModel
            .findByIdAndUpdate(id, extractedInfo, { new: true })
            .exec();
    }
    async searchArticles(searchParams) {
        try {
            const filter = { status: article_status_enum_1.ArticleStatus.Approved };
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
        }
        catch (error) {
            console.error('Error searching articles:', error);
            throw new common_1.InternalServerErrorException('Failed to search articles.');
        }
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map