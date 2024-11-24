import { Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';

import { AppLogger } from './appLogger';

@Injectable()
export class LoggerFactory {
  createLogger(context: string): LoggerService {
    return new AppLogger(context);
  }
}
