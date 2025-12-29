import { IsString, IsInt, IsArray, IsEmail, IsNotEmpty, MinLength, Min, IsOptional } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  studentCount: number;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  studentEmails: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
