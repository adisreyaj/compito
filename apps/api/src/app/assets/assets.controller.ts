import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { lookup } from 'mime-types';
import { Public } from '../core/decorators/public.decorator';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private assets: AssetsService) {}

  @Public()
  @Header('Cache-Control', 'public, max-age=604800, immutable')
  @Get('**')
  async getAsset(@Param('0') path: string, @Res() res: Response) {
    const asset = await this.assets.get(path);
    const mimeType = lookup(path);
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
    asset.pipe(res);
  }
}
