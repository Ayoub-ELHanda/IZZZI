import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  establishmentName?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
