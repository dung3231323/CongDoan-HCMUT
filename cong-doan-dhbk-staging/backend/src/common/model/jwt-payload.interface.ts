import { UserRole } from "@prisma/client";

export interface JwtPayLoad {
  sub: string;
  email: string;
  role: UserRole;
  unionDeptId: string;
  iat: number;
  exp: number;
}
