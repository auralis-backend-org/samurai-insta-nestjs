import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    throw new Error('RECAPTCHA_SITE_KEY is not configured');
  }

  const config = new DocumentBuilder()
    .setTitle('API Backend')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your access token',
      },
      'bearer',
    )
    .addCookieAuth(
      'refreshToken',
      {
        type: 'apiKey',
        in: 'cookie',
      },
      'refreshToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    customJsStr: `
    const siteKey = ${JSON.stringify(recaptchaSiteKey)};

    const script = document.createElement('script');
    script.src = \`https://www.google.com/recaptcha/api.js?render=\${siteKey}\`;

    script.onload = () => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, {
            action: 'register',
          });

          sessionStorage.setItem('recaptchaToken', token);

          console.log('reCAPTCHA TOKEN:', token);
        } catch (error) {
          console.error('reCAPTCHA error:', error);
        }
      });
    };

    script.onerror = () => {
      console.error('Google reCAPTCHA failed to load');
    };

    document.head.appendChild(script);
  `,
  });
}
