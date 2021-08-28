import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileStorageService } from '../core/services/file-storage.service';

@Injectable()
export class AssetsService {
  constructor(private fileStorage: FileStorageService) {}

  async get(path: string) {
    try {
      return await this.fileStorage.get(path);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
