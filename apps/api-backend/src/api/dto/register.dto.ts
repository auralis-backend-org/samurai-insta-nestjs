import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  Equals,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'alex_123',
    description: 'Username: letters, numbers, underscores and hyphens',
    minLength: 6,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  username: string;

  @ApiProperty({
    example: 'igor777samurai@gmail.com',
    description: 'User email',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Password',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/)
  password: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Password confirmation',
  })
  @IsString()
  @IsNotEmpty()
  passwordConfirmation: string;

  @ApiProperty({
    example: true,
    description: 'Acceptance of Terms of Service and Privacy Policy',
  })
  @Equals(true)
  acceptedTerms: boolean;

  @ApiProperty({
    example: 'recaptcha-token',
    description: 'Google reCAPTCHA v3 verification token',
  })
  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}
