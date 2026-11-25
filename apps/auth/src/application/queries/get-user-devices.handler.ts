import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetUserDevicesQuery } from './get-user-devices.query';
import { PrismaAuthRepository } from '../../infrastructure/prisma-auth.repository';

@QueryHandler(GetUserDevicesQuery)
export class GetUserDevicesHandler
  implements IQueryHandler<GetUserDevicesQuery>
{
  constructor(
    private readonly authRepository: PrismaAuthRepository,
  ) {}

  async execute(query: GetUserDevicesQuery) {
    return this.authRepository.findDevicesByUserId(query.userId);
  }
}