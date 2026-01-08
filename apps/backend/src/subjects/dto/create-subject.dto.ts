import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEmail } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  teacherName: string;

  @IsEmail()
  @IsOptional()
  teacherEmail?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  classId: string;
}
