
export enum WorkingStatus {
    WORKING = 'WORKING',
    RESIGNATION = 'RESIGNATION',
    RETIRED = 'RETIRED',
  }

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export const VALIDATION_MESSAGES = {
  IS_STRING: '$property phải là một chuỗi.',
  IS_EMAIL: '$property phải là một email hợp lệ.',
  IS_ENUM: '$property phải là một giá trị hợp lệ.',
  IS_NOT_EMPTY: '$property không được để trống.',
  IS_NUMBER: '$property phải là một số.',
  MIN_LENGTH: '$property phải có ít nhất $constraint1 ký tự.',
  MAX_LENGTH: '$property không được vượt quá $constraint1 ký tự.',
  IS_UUID: '$property phải là id hợp lệ.',
  // Bạn có thể thêm nhiều thông báo khác tùy thuộc vào nhu cầu của bạn
};