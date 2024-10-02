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
let ArticlesService = class ArticlesService {
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async createArticle(createArticleDto) {
        const createdArticle = new this.articleModel(createArticleDto);
        return createdArticle.save();
    }
    async getPendingArticles() {
        return this.articleModel.find({ status: 'pending' }).exec();
    }
    async getManagedArticles() {
        return this.articleModel.find({ status: 'managed' }).exec();
    }
    async getApprovedArticles() {
        return this.articleModel.find({ status: 'approved' }).exec();
    }
    async findAll() {
        return this.articleModel.find().exec();
    }
    async extractArticleInfo(id, extractedInfo) {
        return this.articleModel
            .findByIdAndUpdate(id, extractedInfo, { new: true })
            .exec();
    }
    async searchArticles(searchParams) {
        const query = {};
        if (searchParams.method) {
            query.seMethod = { $regex: searchParams.method, $options: 'i' };
        }
        if (searchParams.claim) {
            query.claim = { $regex: searchParams.claim, $options: 'i' };
        }
        if (searchParams.startYear && searchParams.endYear) {
            query.pubyear = { $gte: searchParams.startYear, $lte: searchParams.endYear };
        }
        else if (searchParams.startYear) {
            query.pubyear = { $gte: searchParams.startYear };
        }
        else if (searchParams.endYear) {
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
    async manageArticle(id, manageArticleDto) {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
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
    async approveArticle(id) {
        const updatedArticle = await this.articleModel
            .findByIdAndUpdate(id, { status: 'approved' }, { new: true })
            .exec();
        if (!updatedArticle) {
            throw new common_1.NotFoundException(`Article with id ${id} not found`);
        }
        return updatedArticle;
    }
    async rejectArticle(id) {
        const deleted = await this.articleModel.findByIdAndDelete(id).exec();
        return !!deleted;
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map