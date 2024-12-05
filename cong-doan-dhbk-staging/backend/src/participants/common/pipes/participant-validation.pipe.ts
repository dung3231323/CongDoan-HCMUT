import { ArgumentMetadata, BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  // Phương thức để chuyển đổi lỗi
  protected flattenValidationErrors(validationErrors: ValidationError[]): any[] {
    const errors = [];

    validationErrors.forEach((error, index) => {
      const constraints = Object.values(error.constraints || {});
      errors.push({
        index: index + 2, // Bắt đầu từ 2
        errors: constraints,
      });
    });

    return errors;
  }

  // Tạo factory cho lỗi
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const errors = this.flattenValidationErrors(validationErrors);

      return new BadRequestException({
        message: "Đã xảy ra lỗi khi tạo hàng loạt",
        errors,
      });
    };
  }
}
