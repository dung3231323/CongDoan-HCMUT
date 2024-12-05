import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AllExceptionsFilter } from "./common/filter/allExceptionFilter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false }));

  const configService = app.get(ConfigService);
  console.log(configService.get("GOOGLE_REDIRECT_URI"));
  const config = new DocumentBuilder()
    .setTitle("CONG DOAN API")
    .setDescription("Cong Doan API description")
    .setVersion("1.0")
    .addTag("achievement")
    .addTag("union-department")
    .addTag("faculty")
    .addTag("participant")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); //https://github.com/nestjs/swagger/issues/92 add trailing slash to the end of the url

  const allowedOrigins = [
    "http://localhost:5173", // Frontend service 1 (development)
    "http://congdoan.tuoitrebachkhoa.edu.vn", // Frontend service 1 (production)
  ];

  app.enableCors({ origin: allowedOrigins, methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", credentials: true });

  const port = configService.get<number>("PORT") || 5000;

  const httpAdapterHost = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
