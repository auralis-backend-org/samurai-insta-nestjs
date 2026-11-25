import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RevokeOtherDeviceSessionsCommand } from './revoke-other-device-sessions.command';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';

@CommandHandler(RevokeOtherDeviceSessionsCommand)
export class RevokeOtherDeviceSessionsHandler
  implements ICommandHandler<RevokeOtherDeviceSessionsCommand>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
  ) {}

  async execute(command: RevokeOtherDeviceSessionsCommand) {
    return this.authRepository.revokeOtherDeviceSessions(
      command.userId,
      command.currentDeviceId,
    );
  }
}