// src/articles/dto/rate-article.dto.ts

import { IsNumber, Min, Max } from 'class-validator';

export class RateArticleDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;
}
