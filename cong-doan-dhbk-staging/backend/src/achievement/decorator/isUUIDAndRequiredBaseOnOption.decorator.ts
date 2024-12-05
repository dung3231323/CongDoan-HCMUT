import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isUUID,
} from "class-validator";

export function IsUUIDAndRequiredBasedOnOption(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isUUIDAndRequiredBasedOnOption",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[args.constraints[0]];
          const isRequired = relatedValue === args.property; // Adjust this condition based on your requirements
          if (relatedValue === "faculty" && args.property === "facultyId") {
            return value != null && isUUID(value);
          } else if (
            relatedValue === "participant" &&
            args.property === "participantId"
          ) {
            return value != null && isUUID(value);
          }
          return true; // If not required, always valid
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} is required when ${args.constraints[0]} is faculty`;
        },
      },
    });
  };
}
