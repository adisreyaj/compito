import { Logger } from '@nestjs/common';
export class CompitoLogger {
  private logger: Logger;
  constructor(scope: string) {
    this.logger = new Logger(scope);
  }

  error(feature: string, operation: string, message: string, error?: any) {
    this.logger.error(`${feature.toUpperCase()}:${operation.toUpperCase()} --> ${message}`, error);
  }
}
