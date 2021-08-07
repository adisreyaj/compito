import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    AuthModule,
    OrganizationModule,
    ProjectModule,
    // TaskModule,
    // TagModule,
    // UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
