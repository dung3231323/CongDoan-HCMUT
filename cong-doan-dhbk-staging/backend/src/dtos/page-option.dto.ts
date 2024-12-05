export enum Order {     //Enum theo hệ thống của prisma
    ASC = "asc",
    DESC = "desc",
}

import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export class PageOptionsDto {
    @ApiPropertyOptional({ enum: Order, enumName: "Order", default: Order.ASC })
    @IsEnum(Order)
    @IsOptional()
    order?: Order = Order.ASC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    take?: number = 10;

    skip: number = (this.page - 1) * this.take;
}
