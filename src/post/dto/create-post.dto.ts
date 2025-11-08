import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'FRIEND'])
  visibility?: string;
}
