import { Injectable, Logger, Scope } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  log(message: string) {
    Logger.log(`${message}`, this.context);
  }

  warn(message: string) {
    Logger.warn(`${message}`, this.context);
  }

  error(message: string) {
    Logger.error(`${message}`, this.context);
  }
}
