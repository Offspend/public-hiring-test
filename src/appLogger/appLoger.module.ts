import { Module } from '@nestjs/common';
import {LoggerFactory} from "./loggerFactory";

@Module({
  providers: [LoggerFactory],
  exports: [LoggerFactory],
})
export class AppLoggerModule {}
