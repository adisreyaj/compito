import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { OrganizationModule } from './organization/organization.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    OrganizationModule,
    ProjectModule,
    UserModule,
    BoardsModule,
    TaskModule,
    // TagModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard('jwt'),
    },
  ],
})
export class AppModule {}
