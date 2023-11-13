import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import configuration from "./utils/config/configuration";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(configuration().PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
