import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { FormType } from '@prisma/client';

export class CreateQuestionnairesDto {
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsEnum(FormType)
  @IsNotEmpty()
  formType: FormType;
}
