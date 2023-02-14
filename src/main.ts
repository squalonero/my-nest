import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

export const configService: ConfigService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: configService.get<boolean>('NEST_DEBUG') || false,
  });

  app.enableCors();
  await app.listen(configService.get<number>('PORT') || 3081);
}
bootstrap();
