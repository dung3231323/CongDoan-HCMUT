import { User } from "@prisma/client";
import { UserId } from "./constants";

export const usersData = [
  { email: "dung.nguyendung4869@hcmut.edu.vn", role: "ADMIN", id: UserId.test },
  { email: "hoang.nguyen2211093@hcmut.edu.vn", role: "ADMIN" },
  { email: "khai.vuongquang@hcmut.edu.vn", role: "ADMIN" },
  { email: "kien.trankiensvbk@hcmut.edu.vn", role: "ADMIN" },
  { email: "tam.nguyenndmt@hcmut.edu.vn", role: "ADMIN" },
  { email: "thuan.phamchezzi@hcmut.edu.vn", role: "ADMIN" },
  { email: "van.bui240504@hcmut.edu.vn", role: "ADMIN" },
  { email: "viet.trankhmtbk22@hcmut.edu.vn", role: "ADMIN" },
  { email: "khoi.duong2004@hcmut.edu.vn", role: "ADMIN" },
  { email: "trung.phamquang@hcmut.edu.vn", role: "ADMIN" },
  { email: "nhut.trannov25th@hcmut.edu.vn", role: "ADMIN" },
] as User[];
