
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  'error-codes'?: string[];
}

@Injectable()
export class RecaptchaService {
  constructor(private readonly configService: ConfigService) {}

  async verify(token: string): Promise<boolean> {
    const secretKey =
      this.configService.getOrThrow<string>('RECAPTCHA_SECRET_KEY');

    if (!token?.trim()) {
      return false;
    }

    try {
      const response = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: secretKey,
            response: token,
          }),
          signal: AbortSignal.timeout(5000),
        },
      );

      if (!response.ok) {
        return false;
      }

      const result =
        (await response.json()) as RecaptchaVerifyResponse;

      // TODO  add in env
      const allowedHostnames = [
        'auralis.online',
        'www.auralis.online',
        'localhost',
        'auralis-online.ru',
        'www.auralis-online.ru',
      ];

      return (
        result.success === true &&
        result.action === 'register' &&
        (result.score ?? 0) >= 0.5 &&
        allowedHostnames.includes(result.hostname ?? '')
      );
    } catch {
      return false;
    }
  }
}
