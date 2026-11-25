export class RevokeDeviceSessionCommand {
  constructor(
    public readonly deviceId: number,
    public readonly userId: number,
  ) {}
}