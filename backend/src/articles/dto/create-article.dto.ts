// src/articles/dto/create-article.dto.ts

import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    title: string;

    @IsString()
    authors: string;

    @IsString()
    source: string;

    @IsNumber()
    pubyear: number;

    @IsString()
    doi: string;

    @IsString()
    claim: string;

    @IsString()
    evidence: string;

    @IsOptional()
    @IsString()
    status?: string; // 可选，后端默认设置为 'pending'
}
