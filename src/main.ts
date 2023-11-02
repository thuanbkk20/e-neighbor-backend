import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { setupSwagger } from './setup-swagger';
declare const module: any;

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);

  const configService = app.select(SharedModule).get(ApiConfigService);

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const port = configService.appConfig.port;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
