// src/articles/dto/extract-info.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class ExtractInfoDto {
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
