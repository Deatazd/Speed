// src/articles/dto/comment-article.dto.ts

import { IsString } from 'class-validator';

export class CommentArticleDto {
    @IsString()
    comment: string;
}
