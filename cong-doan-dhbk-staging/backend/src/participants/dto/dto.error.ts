import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 404, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Not Found', description: 'Error type' })
  error: string;

  
}

export class BadRequestDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Đã xảy ra lỗi', description: 'Error type' })
  error: string;
  
}

