import {Injectable} from '@nestjs/common';
import {AppLogger} from './appLogger';
import {LoggerService} from "@nestjs/common/services/logger.service";

@Injectable()
export class LoggerFactory {
  constructor() {}

  createLogger(context: string): LoggerService {
    return new AppLogger(context);
  }
}
