import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import CoreModule from '@shortener/core/core.module';
import * as Sentry from '@sentry/node';
import { HttpExceptionFilter } from '@shortener/core/exceptions/http-exception.filter';
import { ValidationFilter } from '@shortener/core/exceptions/validation.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import useSwaggerUIAuthStoragePlugin from 'swagger_plugin';
import SentryInterceptor from '@shortener/core/interceptor/sentry.interceptor';
import { json, urlencoded } from 'express';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, {
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  const sentryUrl = configService.get<string>('sentryUrl');

  Sentry.init({
    dsn: sentryUrl,
  });

  app.useGlobalFilters(new HttpExceptionFilter(), new ValidationFilter());
  app.setGlobalPrefix('/');

  const options = new DocumentBuilder()
    .setTitle('Shorten Url Database Bento API')
    .setDescription('API endpoints for Shorten Url')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      plugins: [useSwaggerUIAuthStoragePlugin()],
    },
  });

  app.use(helmet());
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  app.useGlobalInterceptors(new SentryInterceptor());

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  const server = await app.listen(port);

  server.setTimeout(1200000);

  // eslint-disable-next-line
  console.log(`${process.env.NODE_ENV} app running on: ${await app.getUrl()}`);
}

bootstrap();
