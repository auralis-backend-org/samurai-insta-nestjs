import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { VerifyActiveSessionQuery } from './verify-active-session.query';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';

@QueryHandler(VerifyActiveSessionQuery)
export class VerifyActiveSessionHandler
  implements IQueryHandler<VerifyActiveSessionQuery>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
  ) {}

  async execute(query: VerifyActiveSessionQuery): Promise<boolean> {
    const session = await this.authRepository.findActiveDeviceSession(
      query.sessionId,
      query.userId,
    );

    return Boolean(session);
  }
}