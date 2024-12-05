import { Injectable } from "@nestjs/common";
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";
import { PrismaService } from "../../prisma/prisma.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsFacultyExistsConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(facultyId: string, args: ValidationArguments) {
    const faculty = await this.prisma.faculty.findFirst({
      where: { id: facultyId },
    });

    return !!faculty;
  }

  defaultMessage(args?: ValidationArguments) {
    return "Faculty does not exist";
  }
}

export function IsFacultyExist(validationOtions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "FacultyExist",
      target: object.constructor,
      propertyName,
      options: validationOtions,
      constraints: [],
      validator: IsFacultyExistsConstraint,
    });
  };
}
