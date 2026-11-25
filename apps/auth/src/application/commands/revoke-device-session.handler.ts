import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RevokeDeviceSessionCommand } from './revoke-device-session.command';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';

@CommandHandler(RevokeDeviceSessionCommand)
export class RevokeDeviceSessionHandler
  implements ICommandHandler<RevokeDeviceSessionCommand>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
  ) {}

  async execute(command: RevokeDeviceSessionCommand) {
    return this.authRepository.revokeDeviceSession(
      command.deviceId,
      command.userId,
    );
  }
}