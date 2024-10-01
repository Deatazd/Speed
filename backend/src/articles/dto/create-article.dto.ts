import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUrl,
  IsNumber,
  IsOptional, // 引入 IsOptional 装饰器
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

  @IsOptional() // pubyear 是可选的
  @IsNumber()
  readonly pubyear?: number;

  @IsOptional() // doi 是可选的
  @IsUrl()
  readonly doi?: string;

  @IsString()
  readonly claim: string;

  @IsString()
  readonly evidence: string;
}
