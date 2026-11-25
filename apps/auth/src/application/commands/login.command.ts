export interface LoginData {
  email: string;
  password: string;
  userAgent: string;
  ipAddress: string;
}

export class LoginCommand {
  constructor(public readonly data: LoginData) {}
}
