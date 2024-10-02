// src/articles/dto/manage-article.dto.ts

import { IsOptional, IsNumber, Max, Min, IsString } from 'class-validator';

export class ManageArticleDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    seMethod?: string;

    @IsOptional()
    @IsString()
    studyType?: string;

    @IsOptional()
    @IsString()
    evidenceResult?: string;
}
