import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class ReactionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(['like', 'dislike'])
  type: string;
}
