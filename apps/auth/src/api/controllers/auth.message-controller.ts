import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

import {RegisterUserCommand} from "../../application/commands/register-user.command";
import { LoginCommand } from '../../application/commands/login.command';
import { LogoutCommand } from '../../application/commands/logout.command';
import { GetMeQuery } from '../../application/queries/get-me.query';
import { JwtTokenService } from '../../infrastructure/security/jwt-token.service';
import { VerifyEmailCommand } from '../../application/commands/verify-email.command';
import { ResetDatabaseCommand } from '../../application/commands/reset-database.command';
import { ForgotPasswordCommand } from '../../application/commands/forgot-password.command';
import { ResetPasswordCommand } from '../../application/commands/reset-password.command';
import { VerifyActiveSessionQuery } from '../../application/queries/verify-active-session.query';
import { GetUserDevicesQuery } from '../../application/queries/get-user-devices.query';
import { RevokeDeviceSessionCommand } from '../../application/commands/revoke-device-session.command';
import { RevokeOtherDeviceSessionsCommand } from '../../application/commands/revoke-other-device-sessions.command';


@Controller()
export class AuthMessageController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus,  private readonly jwtTokenService: JwtTokenService) {}

  @MessagePattern({ cmd: 'auth.ping' })
  ping() {
    console.log('[AUTH] Received auth.ping');

    const response = {
      status: 'ok',
      service: 'auth',
      message: 'Auth microservice is alive',
      timestamp: new Date().toISOString(),
    };

    console.log('[AUTH] Sending ping response:', response);

    return response;
  }

  @MessagePattern({ cmd: 'auth.register' })
  register(@Payload() dto: RegisterDto) {
    return this.commandBus.execute(
      new RegisterUserCommand({
        username: dto.username,
        email: dto.email,
        password: dto.password,
        passwordConfirmation: dto.passwordConfirmation,
        acceptedTerms: dto.acceptedTerms,
        recaptchaToken: dto.recaptchaToken,
      }),
    );
  }

  @MessagePattern({ cmd: 'auth.login' })
  login(@Payload() dto: LoginDto) {
    return this.commandBus.execute(
      new LoginCommand({
        email: dto.email,
        password: dto.password,
        userAgent: dto.userAgent ?? 'Unknown',
        ipAddress: dto.ipAddress ?? 'Unknown',
      }),
    );
  }

  @MessagePattern({ cmd: 'auth.logout' })
  logout(@Payload() data: { refreshToken: string }) {
    return this.commandBus.execute(
      new LogoutCommand(data.refreshToken),
    );
  }

  @MessagePattern({ cmd: 'auth.verify-access-token' })
  async verifyAccessToken(
    @Payload() data: { accessToken: string },
  ) {
    const payload = await this.jwtTokenService.verifyAccessToken(
      data.accessToken,
    );

    const isSessionActive = await this.queryBus.execute(
      new VerifyActiveSessionQuery(payload.sub, payload.sessionId),
    );

    if (!isSessionActive) {
      throw new RpcException({
        statusCode: 401,
        message: 'Session has been revoked',
      });
    }

    return payload;
  }

  @MessagePattern({ cmd: 'auth.me' })
  async getMe(@Payload() data: { userId: number }) {
    return this.queryBus.execute(
      new GetMeQuery(data.userId),
    );
  }

  @MessagePattern({ cmd: 'auth.get-devices' })
  async getDevices(@Payload() data: { userId: number }) {
    return this.queryBus.execute(
      new GetUserDevicesQuery(data.userId),
    );
  }

  @MessagePattern({ cmd: 'auth.revoke-device-session' })
  async revokeDeviceSession(
    @Payload() data: { deviceId: number; userId: number },
  ) {
    return this.commandBus.execute(
      new RevokeDeviceSessionCommand(data.deviceId, data.userId),
    );
  }

  @MessagePattern({ cmd: 'auth.revoke-other-device-sessions' })
  async revokeOtherDeviceSessions(
    @Payload() data: {
      userId: number;
      currentDeviceId: number;
    },
  ) {
    return this.commandBus.execute(
      new RevokeOtherDeviceSessionsCommand(
        data.userId,
        data.currentDeviceId,
      ),
    );
  }

  @MessagePattern({ cmd: 'auth.verify-email' })
  async verifyEmail(@Payload() data: { token: string }) {
    return this.commandBus.execute(
      new VerifyEmailCommand(data.token),
    );
  }

  @MessagePattern({ cmd: 'database.reset' })
  async resetDatabase() {
    return this.commandBus.execute(new ResetDatabaseCommand());
  }

  @MessagePattern({ cmd: 'auth.forgot-password' })
  async forgotPassword(@Payload() data: { email: string }) {
    await this.commandBus.execute(
      new ForgotPasswordCommand(data.email),
    );

    return {
      message: 'If an account with this email exists, a password reset link has been sent.',
    };
  }

  @MessagePattern({ cmd: 'auth.reset-password' })
  async resetPassword(
    @Payload() data: {
      token: string;
      newPassword: string;
    },
  ) {
    await this.commandBus.execute(
      new ResetPasswordCommand(data.token, data.newPassword),
    );

    return {
      message: 'Password has been reset successfully',
    };
  }


}