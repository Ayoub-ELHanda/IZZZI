import { IsString, IsInt, Min, Max, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class SubmitResponseDto {
  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsBoolean()
  isAnonymous: boolean;
}
