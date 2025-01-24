import { IsString, MinLength, Matches, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number/special character',
  })
  newPassword!: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email!: string;
}
