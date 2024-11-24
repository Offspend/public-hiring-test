import {Injectable, Scope, Logger} from '@nestjs/common';
import {LoggerService} from "@nestjs/common/services/logger.service";

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  constructor(private readonly context: string) {
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
