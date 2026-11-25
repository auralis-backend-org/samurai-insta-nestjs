- Добавляем модель EmailVerificationToken
  model EmailVerificationToken {
  id        Int      @id @default(autoincrement())
  tokenHash String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("email_verification_tokens")
  }
- npx prisma migrate dev --name add_email_verification

npx http-server . -p 5500

allow pasting

grecaptcha.ready(async () => {
const token = await grecaptcha.execute(
'6LdjKC8uAAAAAExkaiGfQ0dbV0PV4E7WmoN6uDjO',
{ action: 'register' }
);

console.log(token);
});

grecaptcha.ready(async () => {
const token = await grecaptcha.execute(
window.RECAPTCHA_SITE_KEY,
{ action: 'register' },
);

sessionStorage.setItem('recaptchaToken', token);
});



#######

const siteKey = '6LdjKC8uAAAAAExkaiGfQ0dbV0PV4E7WmoN6uDjO';

const script = document.createElement('script');
script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;

script.onload = () => {
grecaptcha.ready(async () => {
try {
const token = await grecaptcha.execute(siteKey, {
action: 'register',
});

      console.log('reCAPTCHA TOKEN:', token);
    } catch (error) {
      console.error(error);
    }
});
};

script.onerror = () => console.error('Google reCAPTCHA failed to load');

document.head.appendChild(script);


## prod  recaptcha token

const siteKey = '6LdjKC8uAAAAAExkaiGfQ0dbV0PV4E7WmoN6uDjO';

const script = document.createElement('script');
script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;

script.onload = () => {
grecaptcha.ready(async () => {
try {
const token = await grecaptcha.execute(siteKey, {
action: 'register',
});

      sessionStorage.setItem('recaptchaToken', token);

      console.log('reCAPTCHA TOKEN:', token);
      console.log('Saved to sessionStorage');
    } catch (error) {
      console.error('reCAPTCHA error:', error);
    }
});
};

script.onerror = () => console.error('Google reCAPTCHA failed to load');

document.head.appendChild(script);