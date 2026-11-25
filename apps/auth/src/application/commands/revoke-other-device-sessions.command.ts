export class RevokeOtherDeviceSessionsCommand {
  constructor(
    public readonly userId: number,
    public readonly currentDeviceId: number,
  ) {}
}