import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'FRIEND'])
  visibility?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;
}
