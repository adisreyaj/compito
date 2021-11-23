import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AssetsModule } from './assets/assets.module';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { ENV_VALIDATION_SCHEMA } from './core/config/env.config';
import { AuthGuard } from './core/guards/auth.guard';
import { InviteModule } from './invite/invite.module';
import { OrganizationModule } from './organization/organization.module';
import { ProjectModule } from './project/project.module';
import { RoleModule } from './role/role.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ENV_VALIDATION_SCHEMA,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        prettyPrint: process.env.NODE_ENV !== 'production',
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'warn',
        redact: ['req.headers.authorization', 'res.headers'],
      },
    }),
    // SentryModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (cfg: ConfigService) => ({
    //     dsn: cfg.get('SENTRY_API_DSN', { infer: true }),
    //     debug: false,
    //     environment: cfg.get('NODE_ENV'),
    //     release: cfg.get('SENTRY_RELEASE'),
    //     logLevel: LogLevel.Error,
    //   }),
    //   inject: [ConfigService],
    // }),
    HttpModule,
    TerminusModule,
    AssetsModule,
    AuthModule,
    OrganizationModule,
    ProjectModule,
    UserModule,
    BoardsModule,
    TaskModule,
    InviteModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
