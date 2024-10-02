import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUrl,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsArray()
  @IsString({ each: true })
  readonly authors: string[];

  @IsString()
  @IsNotEmpty()
  readonly source: string;

  @IsOptional()
  @IsNumber()
  readonly pubyear?: number;

  @IsOptional()
  @IsUrl()
  readonly doi?: string;

  @IsString()
  readonly claim: string;

  @IsString()
  readonly evidence: string;

  @IsOptional()
  @IsString()
  readonly seMethod?: string; // SE 方法

  @IsOptional()
  @IsString()
  readonly studyType?: string; // 研究类型

  @IsOptional()
  @IsString()
  readonly evidenceResult?: string; // 证据结果
}
