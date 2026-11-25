export class VerifyActiveSessionQuery {
  constructor(
    public readonly userId: number,
    public readonly sessionId: number,
  ) {}
}