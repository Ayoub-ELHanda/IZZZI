import { IsEnum, IsNotEmpty } from 'class-validator';
import { FormType } from '@prisma/client';

export class UpdateQuestionnairesDto {
  @IsEnum(FormType)
  @IsNotEmpty()
  formType: FormType;
}
