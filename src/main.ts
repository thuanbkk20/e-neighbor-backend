import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { middleware as expressCtx } from 'express-ctx';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { SerializerInterceptor } from './interceptors/serializer-interceptor';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

import { OAuthException } from '@/exceptions';

declare const module: any;

async function bootstrap() {
  initializeTransactionalContext();
  const whitelist = [
    'http://localhost:8000',
    'https://e-neighbor.netlify.app',
    'https://sandbox.vnpayment.vn/',
  ];
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: {
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        origin: function (origin, callback) {
          if (!origin) {
            callback(null, true);
            return;
          }
          if (
            whitelist.includes(origin) // Checks your whitelist
            // || !!origin.match(/yourdomain\.com$/) // Overall check for your domain
          ) {
            console.log('allowed cors for:', origin);
            callback(null, true);
          } else {
            console.log('blocked cors for:', origin);
            callback(new OAuthException('Not allowed by CORS'), false);
          }
        },
      },
    },
  );

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new SerializerInterceptor(),
  );

  app.setGlobalPrefix('/api/v1');

  const configService = app.select(SharedModule).get(ApiConfigService);

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  app.use(expressCtx);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const port = configService.appConfig.port;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
