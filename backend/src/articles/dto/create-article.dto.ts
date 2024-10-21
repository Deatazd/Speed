// src/articles/dto/create-article.dto.ts

import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    authors: string[];

    @IsString()
    @IsNotEmpty()
    source: string;

    @IsNumber()
    pubyear: number;

    @IsString()
    @IsNotEmpty()
    doi: string;

    @IsString()
    @IsNotEmpty()
    claim: string;

    @IsString()
    @IsNotEmpty()
    evidence: string;
}
