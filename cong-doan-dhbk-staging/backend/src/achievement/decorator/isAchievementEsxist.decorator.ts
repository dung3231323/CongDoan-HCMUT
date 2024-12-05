import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsAchievementExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private prisma: PrismaService) {}

  async validate(content: string, args: ValidationArguments) {
    const achievement = await this.prisma.achievement.findFirst({
      where: { content },
    });

    return !achievement;
  }

  defaultMessage(args?: ValidationArguments) {
    return 'Achievement is exist';
  }
}

export function IsAchievementExist(validationOtions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'FacultyExist',
      target: object.constructor,
      propertyName,
      options: validationOtions,
      constraints: [],
      validator: IsAchievementExistConstraint,
    });
  };
}
