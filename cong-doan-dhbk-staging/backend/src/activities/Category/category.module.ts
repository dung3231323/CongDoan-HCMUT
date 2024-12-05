import { Global, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResponseModule } from 'src/response/response.module';

@Global()
@Module({
  imports: [PrismaModule, ResponseModule],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}
