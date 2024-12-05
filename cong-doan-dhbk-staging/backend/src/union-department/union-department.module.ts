import { Module } from '@nestjs/common';
import { UnionDepartmentController } from './union-department.controller';
import { UnionDepartmentService } from './union-department.service';

@Module({
  controllers: [UnionDepartmentController],
  providers: [UnionDepartmentService]
})
export class UnionDepartmentModule {}
