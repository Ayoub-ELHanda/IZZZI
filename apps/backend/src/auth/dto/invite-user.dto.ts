import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEnum(['TEACHER', 'STUDENT'])
  @IsNotEmpty()
  role: 'TEACHER' | 'STUDENT';
}

