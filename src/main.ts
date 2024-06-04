import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { dataSource } from "../config/dataSource";
import { AppModule } from "./app.module";
import { ExceptionLogger } from "./common/exceptionLogger.filter";

async function bootstrap() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionLogger());

  const documentationConfig = new DocumentBuilder()
      .setTitle('My food product footprint calculator API')
      .setDescription('This API helps you calculate the carbon footprint of your food products.')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, documentationConfig);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
Logger.log(`Server running on http://localhost:3000`, "Bootstrap");
bootstrap();
