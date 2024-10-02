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
        const newArticle = new this.articleModel(createArticleDto);
        return newArticle.save();
    }
    async getPendingArticles() {
        return this.articleModel.find({ status: 'pending' }).exec();
    }
    async searchArticles(searchParams) {
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
    async extractArticleInfo(id, extractedInfo) {
        const { seMethod, studyType, evidenceResult } = extractedInfo;
        return this.articleModel
            .findByIdAndUpdate(id, { seMethod, studyType, evidenceResult }, { new: true })
            .exec();
    }
    async approveArticle(id) {
        return this.articleModel
            .findByIdAndUpdate(id, { status: 'approved' }, { new: true })
            .exec();
    }
    async rejectArticle(id) {
        return this.articleModel
            .findByIdAndUpdate(id, { status: 'rejected' }, { new: true })
            .exec();
    }
    async rateArticle(id, rating) {
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
    async commentArticle(id, comment) {
        const article = await this.articleModel.findById(id).exec();
        if (!article.comments) {
            article.comments = [];
        }
        article.comments.push(comment);
        return article.save();
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map