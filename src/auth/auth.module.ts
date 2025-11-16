import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // ensure ConfigService is available to providers
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        // read raw value from env (string or number)
        const raw = config.get<string | number>('JWT_EXPIRES_IN');

        // determine final expiresIn type: number (seconds) or StringValue (ms-style string)
        let expiresIn: number | import('ms').StringValue | undefined;

        if (raw === undefined || raw === null || raw === '') {
          expiresIn = '1h'; // default: 3600 seconds
        } else if (typeof raw === 'number') {
          expiresIn = raw;
        } else {
          const trimmed = raw.toString().trim();
          // purely numeric string -> treat as number of seconds
          if (/^\d+$/.test(trimmed)) {
            expiresIn = Number(trimmed);
          } else {
            // human readable like '1h', '30m', '3600s' -> cast to ms.StringValue
            expiresIn = trimmed as import('ms').StringValue;
          }
        }

        return {
          secret: config.get<string>('JWT_SECRET') || 'fallback_secret',
          signOptions: {expiresIn},
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
