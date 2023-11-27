import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import configuration from "./utils/config/configuration";
import { ValidationPipe } from "@nestjs/common";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.enableCors({
    allowedHeaders: ["content-type", "authorization"],
    credentials: true,
    origin: process.env.CORS_ALLOWED_ORIGINS.split(",")
  });

  await app.listen(configuration().PORT);


  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
