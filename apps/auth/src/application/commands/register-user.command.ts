export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
  recaptchaToken: string;
}

export class RegisterUserCommand {
  constructor(public readonly data: RegisterUserData) {}
}