import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extension } from 'mime-types';
import { Client } from 'minio';
import { CompitoLoggerService } from '../utils/logger.service';

@Injectable()
export class FileStorageService {
  private client: Client;
  private logger = this.compitoLogger.getLogger('FILE_STORAGE');
  constructor(private config: ConfigService, private compitoLogger: CompitoLoggerService) {
    this.client = this.createMinioInstance();
  }

  private createMinioInstance(): Client {
    return new Client({
      endPoint: this.config.get('FILE_STORAGE_URI'),
      useSSL: true,
      pathStyle: true,
      region: 'ap-mumbai-1',
      accessKey: this.config.get('FILE_STORAGE_ACCESS_KEY'),
      secretKey: this.config.get('FILE_STORAGE_ACCESS_SECRET'),
    });
  }

  async get(path: string) {
    const bucket = this.config.get('BUCKET');
    return this.client.getObject(bucket, path);
  }

  async upload(file: any, name: string, folder: string) {
    const bucket = this.config.get('BUCKET');
    const fileName = `${folder}/${name}.${extension(file.mimetype)}`;
    try {
      const result = await this.client.putObject(bucket, fileName, file.buffer);
      return { result, filePath: fileName };
    } catch (error) {
      this.logger.error('upload', 'Failed to upload', error);
      return null;
    }
  }

  async delete(path: string) {
    const bucket = this.config.get('BUCKET');
    try {
      await this.client.removeObject(bucket, path);
      return true;
    } catch (error) {
      this.logger.error('delete', 'Failed to delete object', error);
      return false;
    }
  }
}
