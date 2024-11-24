import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { dataSource } from '../config/dataSource';
import { AppModule } from './app.module';
import { version } from '../package.json';

async function bootstrap() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const config = new DocumentBuilder()
    .setTitle('Greenly Hiring Test')
    .setDescription('API used for Greenly Hiring')
    .setVersion(version)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
Logger.log('Server running on http://localhost:3000', 'Bootstrap');
bootstrap();
