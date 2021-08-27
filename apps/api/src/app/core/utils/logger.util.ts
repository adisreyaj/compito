import { Logger } from '@nestjs/common';
export class CompitoLogger {
  private logger: Logger;
  constructor(scope: string) {
    this.logger = new Logger(scope);
  }

  error(operation: string, message: string, error?: any) {
    this.logger.error(`${operation.toUpperCase()} --> ${message}`, error);
  }
}
