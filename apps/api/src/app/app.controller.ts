import { Controller, Get } from '@nestjs/common';
import { Public } from './core/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('ping')
  getData() {
    return { status: 'OK' };
  }
}
