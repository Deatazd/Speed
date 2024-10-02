// src/articles/dto/search-article.dto.ts

import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SearchArticleDto {
    @IsOptional()
    @IsString()
    method?: string;

    @IsOptional()
    @IsString()
    claim?: string;

    @IsOptional()
    @IsNumber()
    startYear?: number;

    @IsOptional()
    @IsNumber()
    endYear?: number;

    @IsOptional()
    @IsString()
    studyType?: string;

    @IsOptional()
    @IsString()
    evidenceResult?: string;
}
