import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateParticipantDto, CreateParticipantsDto } from "./dto/dto.participant";

import { Participant, Prisma } from "@prisma/client";
import { FilterParticipantDto } from "./dto/dto.filterParticipant";
import { EditParticipantDto } from "./dto/dto.editParticipant";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { EditMultipleParticipantsDto } from "./dto/dto.editBulk";
import { ValidationException } from "./dto/dto.validation";

export let A = [];
@Injectable()
export class ParticipantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getParticipantById(id: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { id },
      include: {
        achievements: true,
        childs: true,
        activities: true,
      },
    });

    if (!participant) {
      throw new NotFoundException(`Thành viên với id ${id} không tồn tại !`);
    }

    return participant;
  }

  async getAllParticipants() {
    const where = {};
    const [participants, total] = await Promise.all([
      this.prisma.participant.findMany({
        where,
        include: {
          achievements: true,
          childs: true,
          activities: true,
        },
      }),
      this.prisma.participant.count({ where }),
    ]);

    if (participants.length === 0) {
      //throw new NotFoundException("Danh sách người dùng rỗng !");
      return;
    }

    return {
      data: participants,
      total,
    };
  }

  async updateParticipant(id: string, updateParticipantDto: EditParticipantDto): Promise<Participant> {
    const {
      familyName,
      givenName,
      email,
      phone,
      facultyId,
      workingStatus,
      sID,
      gender,
      isUnionMember,
      uID,
      unionJoinDate,
      numOfChildren,
      children,
      dob,
    } = updateParticipantDto;

    const participantRecord = await this.prisma.participant.findUnique({
      where: { id },
      include: { childs: true },
    });

    const errors: string[] = [];
    if (!participantRecord) {
      throw new NotFoundException("Người dùng không tồn tại !");
    }

    const data: Partial<Participant> = {};

    // Check and update email
    if (sID && sID !== participantRecord.sID) {
      const existingSID = await this.prisma.participant.findUnique({ where: { sID } });
      if (existingSID) {
        errors.push("sID đã được sử dụng !");
      }
      data.sID = sID;
    }

    // Update faculty
    if (facultyId !== undefined && facultyId !== participantRecord.facultyId) {
      const facultyRecord = await this.prisma.faculty.findUnique({ where: { id: facultyId } });
      if (!facultyRecord) {
        errors.push("Khoa/phòng ban không hợp lệ !");
      }
      data.facultyName = facultyRecord.name;
      data.facultyId = facultyRecord.id;

      if (participantRecord.isUnionMember === true) {
        data.unionDeptId = facultyRecord.unionDeptId;
      }
    }

    // Handle union member changes
    if (participantRecord.isUnionMember == true) {
      if (isUnionMember === false) {
        await this.prisma.child.deleteMany({ where: { parentId: id } });
        data.isUnionMember = isUnionMember;
        data.workingStatus = null;
        data.numOfChildren = 0;
        data.uID = null;
        data.unionJoinDate = null;
        data.unionDeptId = null;
      } else {
        if (unionJoinDate) data.unionJoinDate = unionJoinDate;
        if (workingStatus) data.workingStatus = workingStatus;

        if (numOfChildren !== undefined) {
          if (children === undefined) {
            errors.push("Vui lòng điền dữ liệu của con cái !");
          }
          if (numOfChildren > participantRecord.numOfChildren) {
            if (children?.length !== numOfChildren) {
              errors.push("Số lượng con không hợp lệ !");
            }
            for (const child of children) {
              if (child.id) {
                await this.prisma.child.update({
                  where: { id: child.id },
                  data: { ...child, parentId: participantRecord.id },
                });
              } else {
                await this.prisma.child.create({
                  data: { ...child, parentId: participantRecord.id },
                });
                data.numOfChildren = children.length;
              }
            }
          } else if (numOfChildren < participantRecord.numOfChildren) {
            await this.prisma.child.deleteMany({ where: { parentId: id } });
            if (children?.length !== numOfChildren) {
              errors.push("Số lượng con không hợp lệ");
            }
            for (const child of children) {
              await this.prisma.child.create({ data: { ...child, parentId: participantRecord.id } });
            }
            data.numOfChildren = numOfChildren;
          } else {
            const existingChildren = await this.prisma.child.findMany({ where: { parentId: participantRecord.id } });
            const existingChildrenIds = existingChildren.map((child) => child.id);
            const updateChildrenIds = children?.map((child) => child.id) || [];
            const childrenToDelete = existingChildrenIds.filter((id) => !updateChildrenIds.includes(id));
            await this.prisma.child.deleteMany({ where: { id: { in: childrenToDelete } } });

            participantRecord.numOfChildren -= childrenToDelete.length;
            await this.prisma.participant.update({
              where: { id: participantRecord.id },
              data: { numOfChildren: participantRecord.numOfChildren },
            });

            for (const child of children) {
              if (child.id) {
                await this.prisma.child.update({
                  where: { id: child.id },
                  data: { ...child, parentId: participantRecord.id },
                });
              } else {
                await this.prisma.child.create({
                  data: { ...child, parentId: participantRecord.id },
                });
                data.numOfChildren = children.length;
              }
            }
          }
        }

        if (uID && uID !== participantRecord.uID) {
          const existingUID = await this.prisma.participant.findUnique({ where: { uID } });
          if (existingUID) {
            errors.push("uID đã được sử dụng");
          }
          data.uID = uID;
        }
      }
    } else {
      if (isUnionMember === true) {
        let find_id = "";
        if (facultyId === undefined) {
          find_id = participantRecord.facultyId;
        } else {
          find_id = facultyId;
        }
        const facultyRecord = await this.prisma.faculty.findUnique({
          where: { id: find_id },
        });
        console.log(facultyRecord);
        if (!facultyRecord) {
          errors.push("Không tìm thấy bản ghi khoa/phòng ban!");
        } else {
          data.unionDeptId = facultyRecord.unionDeptId;
        }
        data.isUnionMember = isUnionMember;
        if (unionJoinDate === undefined) {
          errors.push("Vui lòng điền trường ngày gia nhập công đoàn !");
        } else {
          data.unionJoinDate = new Date(unionJoinDate);
        }

        if (workingStatus === undefined) {
          errors.push("Vui lòng điền trạng thái làm việc");
        } else {
          data.workingStatus = workingStatus;
        }

        if (numOfChildren === undefined) {
          errors.push("Vui lòng điền số lượng con !");
        } else {
          data.numOfChildren = numOfChildren;
        }

        if (numOfChildren > 0) {
          if (children?.length !== numOfChildren) {
            errors.push("Số lượng con không hợp lệ !");
          }
          for (const child of children) {
            await this.prisma.child.create({ data: { ...child, parentId: participantRecord.id } });
          }
          data.numOfChildren = numOfChildren;
        }
      } else if (isUnionMember === false || isUnionMember === undefined) {
        if (workingStatus !== undefined || unionJoinDate !== undefined || uID !== undefined) {
          errors.push("Thành viên không thuộc công đoàn, vui lòng bỏ qua các trường liên quan !");
        }
      } else {
      }
    }

    // Update participant record with new data
    if (dob) data.dob = dob;
    if (familyName) data.familyName = familyName;
    if (givenName) data.givenName = givenName;
    if (phone) data.phone = phone;
    if (gender) data.gender = gender;
    if (email) data.email = email;

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.prisma.participant.update({
      where: { id },
      data,
    });
  }

  async editBulkParticipants(dto: EditMultipleParticipantsDto): Promise<Participant[]> {
    const updatedParticipants: Participant[] = [];
    const errors: any = {};

    let detailedErrors: { sID: string; detailError: string[]; participant: EditParticipantDto }[] = [];
    const addError = (sID: string, message: string) => {
      const existingError = detailedErrors.find((error) => error.sID === sID);
      if (existingError) {
        existingError.detailError.push(message);
      } else {
        const curPar = dto.participants.find((par) => par.sID === sID);
        detailedErrors.push({ sID, detailError: [message], participant: curPar });
      }
    };

    for (const updateParticipantDto of dto.participants) {
      const {
        familyName,
        givenName,
        email,
        phone,
        dob,
        facultyId,
        workingStatus,
        sID,
        gender,
        isUnionMember,
        uID,
        unionJoinDate,
        numOfChildren,
        children,
      } = updateParticipantDto;

      const participantRecord = await this.prisma.participant.findUnique({
        where: { sID },
        include: { childs: true },
      });

      if (!participantRecord) {
        addError(sID, "Thành viên không tồn tại !");
        continue; 
      }

      const data: Partial<Participant> = {};

      if (sID && sID !== participantRecord.sID) {
        const existingSID = await this.prisma.participant.findUnique({ where: { sID } });
        if (existingSID) {
          if (!errors[sID]) errors[sID] = [];
          errors[sID].push(`sID ${sID} đã được sử dụng!`);
          addError(sID, `sID ${sID} đã được sử dụng!`);
          continue; 
        }
        data.sID = sID;
      }

      if (facultyId !== undefined && facultyId !== participantRecord.facultyId) {
        const facultyRecord = await this.prisma.faculty.findUnique({ where: { id: facultyId } });
        if (!facultyRecord) {
          if (!errors[sID]) errors[sID] = [];
          errors[sID].push(`Khoa/phòng ban không hợp lệ`);
          addError(sID, `Khoa/phòng ban không hợp lệ`);
          continue; // Bỏ qua nếu facultyId không hợp lệ
        } else {
          data.facultyName = facultyRecord.name;
          data.facultyId = facultyRecord.id;

          if (participantRecord.isUnionMember) {
            data.unionDeptId = facultyRecord.unionDeptId;
          }
        }
      }
if (participantRecord.isUnionMember === true) {
        if (isUnionMember === false) {
          await this.prisma.child.deleteMany({ where: { parentId: participantRecord.id } });
          data.isUnionMember = isUnionMember;
          data.workingStatus = null;
          data.numOfChildren = 0;
          data.uID = null;
          data.unionJoinDate = null;
          data.unionDeptId = null;
        } else {
          if (unionJoinDate) data.unionJoinDate = unionJoinDate;
          if (workingStatus) data.workingStatus = workingStatus;

          if (numOfChildren !== undefined) {
            data.numOfChildren = numOfChildren;
            if (!children) {
              if (!errors[sID]) errors[sID] = [];
              errors[sID].push(`Vui lòng điền dữ liệu con cái`);
              addError(sID, `Vui lòng điền dữ liệu con cái`);
            } else if (children.length !== numOfChildren) {
              if (!errors[sID]) errors[sID] = [];
              errors[sID].push(`Số lượng con không hợp lệ`);
              addError(sID, `Số lượng con không hợp lệ`);
            } else {
              const incomingChildIds: string[] = [];
              for (const child of children) {
                if (child.id) {
                  await this.prisma.child.update({
                    where: { id: child.id },
                    data: { ...child, parentId: participantRecord.id },
                  });
                  incomingChildIds.push(child.id);
                } else {
                  const newChild = await this.prisma.child.create({
                    data: { ...child, parentId: participantRecord.id },
                  });
                  incomingChildIds.push(newChild.id); // Thêm id của child mới vừa được tạo vào danh sách
                }
              }
              await this.prisma.child.deleteMany({
                where: {
                  parentId: participantRecord.id,
                  id: { notIn: incomingChildIds },
                },
              });
            }
          }
          if (uID && uID !== participantRecord.uID) {
            const existingUID = await this.prisma.participant.findUnique({ where: { uID } });
            if (existingUID) {
              if (!errors[sID]) errors[sID] = [];
              errors[sID].push(`MSCĐV ${uID} đã được sử dụng !`);
              addError(sID, `MSCĐV ${uID} đã được sử dụng !`);
              continue; 
            }
            data.uID = uID;
          }
        }
      } else {
        if (isUnionMember === true) {
          data.isUnionMember = isUnionMember;
          if (!unionJoinDate) {
            if (!errors[sID]) errors[sID] = [];
            errors[sID].push(`Vui lòng điền ngày gia nhập công đoàn !`);
            addError(sID, `Vui lòng điền ngày gia nhập công đoàn !`);
          } else {
data.unionJoinDate = new Date(unionJoinDate);
          }

          if (!workingStatus) {
            if (!errors[sID]) errors[sID] = [];
            errors[sID].push(`Vui lòng điền trạng thái làm việc !`);
            addError(sID, `Vui lòng điền trạng thái làm việc !`);
          } else {
            data.workingStatus = workingStatus;
          }

          if (numOfChildren === undefined) {
            if (!errors[sID]) errors[sID] = [];
            errors[sID].push(`Vui lòng điền số lượng con cái !`);
            addError(sID, `Vui lòng điền số lượng con cái !`);
          } else {
            data.numOfChildren = numOfChildren;
          }

          if (numOfChildren > 0) {
            if (children.length !== numOfChildren) {
              if (!errors[sID]) errors[sID] = [];
              errors[sID].push(`Số lượng con không hợp lệ !`);
              addError(sID, `Số lượng con không hợp lệ !`);
            }
            for (const child of children) {
              await this.prisma.child.create({ data: { ...child, parentId: participantRecord.id } });
            }
            data.numOfChildren = numOfChildren;
          }
        }
      }

      if (familyName) data.familyName = familyName;
      if (givenName) data.givenName = givenName;
      if (phone) data.phone = phone;
      if (gender) data.gender = gender;
      if (email) data.email = email;
      if (dob) data.dob = dob;

      if (errors[sID] && errors[sID].length > 0) {
        console.error(`Errors for sID ${sID}:`, errors[sID]);
        continue; // Bỏ qua việc cập nhật nếu có lỗi
      }

      const updatedParticipant = await this.prisma.participant.update({
        where: { sID },
        data,
      });

      updatedParticipants.push(updatedParticipant);
    }

    if (Object.keys(detailedErrors).length > 0) {
      throw new BadRequestException(detailedErrors);
    }

    return updatedParticipants;
  }

  async createParticipant(createParticipantDto: CreateParticipantDto) {
    const {
      familyName,
      givenName,
      email,
      phone,
      facultyId,
      workingStatus,
      sID,
      gender,
      isUnionMember,
      uID,
      dob,
      unionJoinDate,
      numOfChildren,
      children,
    } = createParticipantDto;

    let data: any = {
      familyName,
      givenName,
      email,
      phone,
      dob,
      sID,
      gender,
      isUnionMember,
    };

    const errors = [];

    const existingSID = await this.prisma.participant.findUnique({
      where: { sID },
    });
    if (existingSID) {
      errors.push("Mã số cán bộ đã được sử dụng !");
    }

    const facultyExists = await this.prisma.faculty.findUnique({
      where: { id: facultyId },
    });
    if (!facultyExists) {
      errors.push("Khoa/phòng ban không hợp lệ !");
    } else {
      data = {
        ...data,
        faculty: {
          connect: {
            id: facultyId,
          },
        },
      };
      data.facultyName = facultyExists.name
    }

    if (isUnionMember) {
      const foundUnionDept = await this.prisma.unionDepartment.findUnique({
        where: { id: facultyExists.unionDeptId },
      });
      if (!foundUnionDept) {
        errors.push("Công đoàn không tồn tại !");
      } else {
        data = {
          ...data,
          unionDept: {
            connect: {
              id: foundUnionDept.id,
            },
          },
          uID,
          workingStatus,
          unionJoinDate: unionJoinDate ? new Date(unionJoinDate) : null,
        };

        const existingUID = await this.prisma.participant.findUnique({
          where: { uID },
        });
        if (existingUID) {
          errors.push("Mã số công đoàn viên đã được sử dụng");
        }

        if (numOfChildren > 0) {
          if (!children || children.length !== numOfChildren) {
            errors.push("Số lượng con không hợp lệ !");
          } else {
            data = {
              ...data,
              numOfChildren,
              childs: {
                create: children || [],
              },
            };
          }
        } else if (numOfChildren == 0) {
          if (children.length > 0) {
            errors.push("Số lượng con là 0 !");
          }
        } else {
          errors.push("Số lượng con phải lớn hơn hoặc bằng 0 !");
        }
      }
    } else {
      if (uID || workingStatus || unionJoinDate || numOfChildren > 0 || children.length > 0) {
        errors.push("Thành viên không thuộc công đoàn !");
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Tạo participant bằng Prisma
    return {
      success: true,
      participant: await this.prisma.participant.create({
        data,
      }),
    };
  }

  async createAllParticipants(createParticipantsDto: CreateParticipantsDto) {
    const { participants } = createParticipantsDto;
    const results = [];
    const errors = [];

    // Truy xuất danh sách các sID đã tồn tại trong cơ sở dữ liệu
    const existingParticipants = await this.prisma.participant.findMany({
      select: { sID: true, uID: true }, // Chỉ lấy sID để tối ưu hóa
    });
    const existingSIDs = new Set(existingParticipants.map((p) => p.sID));
    for (const [index, createParticipantDto] of participants.entries()) {
      const { sID } = createParticipantDto;

      if (existingSIDs.has(sID)) {
        // Nếu sID đã tồn tại trong cơ sở dữ liệu, bỏ qua và ghi nhận thông tin
        results.push({
          action: "skipped",
          participant: createParticipantDto,
          reason: `Thành viên với MSCĐ ${sID} đã tồn tại`,
        });
        continue;
      } else {
        try {
          // Nếu sID chưa tồn tại, tiến hành tạo mới
          const result = await this.createParticipant(createParticipantDto);

          if (result.success) {
            results.push({ action: "created", participant: result.participant });
          } else {
            // errors.push({ MSCB: sID, errors: result.errors });
            results.push({
              action: "skipped",
              participant: createParticipantDto,
              reason: result.errors || "Unknown error occurred",
            });
          }
        } catch (error) {
          // Bắt lỗi nếu createParticipant ném ra ngoại lệ
          results.push({
            action: "skipped",
            participant: createParticipantDto,
            reason: error.message || "Unknown error occurred",
          });
          // errors.push({ MSCB: sID, errors: [error.message || "Unknown error occurred"] });
        }
      }
    }

    // if (errors.length > 0) {
    //   throw new BadRequestException({
    //     message: "Đã xảy ra lỗi khi tạo hàng loạt",
    //     errors,
    //   });
    // }

    return results;
  }

  // Filter service
  async filterParticipants(filterParticipantsDto: FilterParticipantDto) {
    const validKeys = [
      "familyName",
      "givenName",
      "phone",
      "email",
      "isUnionMember",
      "workingStatus",
      "numOfChildrenMin",
      "facultyId",
      "dobFrom",
      "dobTo",
    ];
    if (!filterParticipantsDto || typeof filterParticipantsDto !== "object") {
      throw new BadRequestException("Dữ liệu không hợp lệ");
    }

    // Lấy tất cả các keys từ DTO
    const dtoKeys = Object.keys(filterParticipantsDto);

    // Tìm các keys không hợp lệ
    const invalidKeys = dtoKeys.filter((key) => !validKeys.includes(key));

    // Nếu có keys không hợp lệ, ném lỗi
    if (invalidKeys.length > 0) {
      throw new BadRequestException(`Các trường không hợp lệ: ${invalidKeys.join(", ")}`);
    }

    const where: Prisma.ParticipantWhereInput = {};

    // Xây dựng điều kiện lọc dựa trên các trường có giá trị
    if (filterParticipantsDto.familyName) where.familyName = filterParticipantsDto.familyName;
    if (filterParticipantsDto.givenName) where.givenName = filterParticipantsDto.givenName;
    if (filterParticipantsDto.isUnionMember !== undefined) where.isUnionMember = filterParticipantsDto.isUnionMember;
    if (filterParticipantsDto.phone) where.phone = filterParticipantsDto.phone;
    if (filterParticipantsDto.email) where.email = filterParticipantsDto.email;
    if (filterParticipantsDto.workingStatus) where.workingStatus = filterParticipantsDto.workingStatus;
    if (filterParticipantsDto.numOfChildrenMin !== undefined)
      where.numOfChildren = { gte: filterParticipantsDto.numOfChildrenMin };
    if (filterParticipantsDto.facultyId) where.facultyId = filterParticipantsDto.facultyId;
    if (filterParticipantsDto.dobFrom && filterParticipantsDto.dobTo) {
      where.dob = { gte: filterParticipantsDto.dobFrom, lte: filterParticipantsDto.dobTo };
    } else if (filterParticipantsDto.dobFrom) {
      where.dob = { gte: filterParticipantsDto.dobFrom };
    } else if (filterParticipantsDto.dobTo) {
      where.dob = { lte: filterParticipantsDto.dobTo };
    }

    const [participants, total] = await Promise.all([
      this.prisma.participant.findMany({
        where,
        include : {childs: true}
      }),
      this.prisma.participant.count({ where }),
    ]);

    return {
      data: participants,
      total,
    };
  }

  async deleteParticipant(id: string): Promise<void> {
    // Kiểm tra xem participant có tồn tại không
    const participantRecord = await this.prisma.participant.findUnique({
      where: { id: id },
    });

    if (!participantRecord) {
      throw new NotFoundException(`Thành viên với id ${id} không tồn tại`);
    }

    // Xóa các achievements liên quan
    await this.prisma.achievementsOnParticipants.deleteMany({
      where: {
        participantId: id,
      },
    });

    await this.prisma.participantAndActivity.deleteMany({
      where: {
        participantId: id,
      },
    });

    // Xóa các children liên quan
    await this.prisma.child.deleteMany({
      where: {
        parentId: id,
      },
    });

    // Xóa participant
    await this.prisma.participant.delete({
      where: {
        id: id,
      },
    });
  }

  async deleteBulkParticipants(ids: string[]): Promise<{ success: string[]; failed: string[] }> {
    const validIds = [];
    const invalidIds = [];

    // Duyệt qua từng ID trong mảng
    for (const id of ids) {
      try {
        // Kiểm tra xem participant có tồn tại không
        const participantRecord = await this.prisma.participant.findUnique({
          where: { id: id },
        });

        if (participantRecord) {
          validIds.push(id);
        } else {
          invalidIds.push(id);
        }
      } catch (error) {
        invalidIds.push(id); // Xử lý lỗi khác nếu có
      }
    }

    // Xóa các participant hợp lệ và dữ liệu liên quan
    if (invalidIds.length === 0) {
      for (const id of validIds) {
        await this.prisma.achievementsOnParticipants.deleteMany({
          where: {
            participantId: id,
          },
        });

        await this.prisma.participantAndActivity.deleteMany({
          where: {
            participantId: id,
          },
        });

        await this.prisma.child.deleteMany({
          where: {
            parentId: id,
          },
        });

        await this.prisma.participant.delete({
          where: {
            id: id,
          },
        });
      }
    }

    // Trả về kết quả
    return { success: validIds, failed: invalidIds };
  }

  async retired_WorkingStatus(ids: string[]): Promise<{ updatedCount: number; failedIds: string[] }> {
    const failedIds: string[] = [];
    let updatedCount = 0;

    for (const id of ids) {
      try {
        const participant = await this.prisma.participant.findUnique({
          where: { id },
        });

        if (!participant) {
          failedIds.push(id);
          continue; // Bỏ qua cập nhật cho ID không hợp lệ
        }

        // Thực hiện cập nhật cho ID hợp lệ
        await this.prisma.participant.update({
          where: { id },
          data: { workingStatus: "RETIRED" },
        });

        updatedCount++;
      } catch (error) {
        failedIds.push(id); // Ghi nhận ID gặp lỗi trong quá trình cập nhật
      }
    }

    return { updatedCount, failedIds };
  }

  async validateParticipants(participantsDto: CreateParticipantsDto) {
    const validParticipants: CreateParticipantDto[] = [];
    const invalidParticipants: { participant: CreateParticipantDto; errors: string[] }[] = [];
    const retireParticipants = [];

    for (const participantDto of participantsDto.participants) {
      const participantInstance = plainToInstance(CreateParticipantDto, participantDto);
      const errors = await validate(participantInstance);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) => Object.values(error.constraints).join(", "));
        invalidParticipants.push({ participant: participantDto, errors: errorMessages });
      } else {
        validParticipants.push(participantDto);
      }
    }

    const existingParticipants = await this.prisma.participant.findMany({
      select: { sID: true },
    });
    const existingSIDs = existingParticipants.map((p) => p.sID);

    // Lấy danh sách sID từ request
    const requestSIDs = participantsDto.participants.map((p) => p.sID);
    for (const existingSID of existingSIDs) {
      const check_unionMember = await this.prisma.participant.findUnique({
        where: { sID: existingSID },
      });
      if (!requestSIDs.includes(existingSID) && check_unionMember.isUnionMember === true) {
        const retiredParticipant = await this.prisma.participant.findUnique({
          where: { sID: existingSID },
          include: {
            achievements: true,
            childs: true,
            activities: true,
          },
        });
        retireParticipants.push(retiredParticipant);
      }
    }

    if (invalidParticipants.length > 0) {
      throw new ValidationException({
        validParticipants,
        invalidParticipants,
        retireParticipants,
      });
    }
    return { validParticipants, invalidParticipants, retireParticipants };
  }

  async new_validateParticipants(participantsDto: CreateParticipantsDto) {
    const validParticipants: CreateParticipantDto[] = [];
    const invalidParticipants: { participant: CreateParticipantDto; errors: string[] }[] = [];
    let retireParticipants = [];
    const oldParticipants: {
      familyName: string;
      givenName: string;
      email: string;
      dob: Date;
      uID: string;
      isUnionMember: boolean;
      phone: string;
      sID: string;
      facultyId: string;
      unionJoinDate: Date;
      workingStatus: string;
      gender: string;
      numOfChildren: number;
      id: string;
      children: { id: string }[];
    }[] = [];
    const newParticipants: CreateParticipantDto[] = [];

    // Validate các participant trong request
    for (const participantDto of participantsDto.participants) {
      const participantInstance = plainToInstance(CreateParticipantDto, participantDto);
      const errors = await validate(participantInstance);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) => Object.values(error.constraints).join(", "));
        invalidParticipants.push({ participant: participantDto, errors: errorMessages });
      } else {
        validParticipants.push(participantDto);
      }
    }

    // Lấy danh sách sID của những participants đã tồn tại trong database
    const existingParticipants = await this.prisma.participant.findMany({
      select: {
        id: true,
        familyName: true,
        givenName: true,
        email: true,
        phone: true,
        sID: true,
        dob: true,
        facultyId: true,
        gender: true,
        isUnionMember: true,
        uID: true,
        workingStatus: true,
        unionJoinDate: true,
        numOfChildren: true,
        childs: true, // Bao gồm các đối tượng child liên quan
      },
    });

    const existingSIDs = existingParticipants.map((p) => p.sID);
    const requestSIDs = participantsDto.participants.map((p) => p.sID);

    // Phân loại participants mới và cũ
    for (const participantDto of validParticipants) {
      if (existingSIDs.includes(participantDto.sID)) {
        try {
          const existingParticipant = await this.prisma.participant.findUnique({
            where: { sID: participantDto.sID },
            include: {
              childs: true,
            },
          });

          if (existingParticipant) {
            oldParticipants.push({
              id: existingParticipant.id,
              familyName: existingParticipant.familyName,
              givenName: existingParticipant.givenName,
              email: existingParticipant.email,
              phone: existingParticipant.phone,
              sID: existingParticipant.sID,
              dob: existingParticipant.dob,
              facultyId: existingParticipant.facultyId,
              gender: existingParticipant.gender,
              isUnionMember: existingParticipant.isUnionMember,
              uID: existingParticipant.uID,
              workingStatus: existingParticipant.workingStatus,
              unionJoinDate: existingParticipant.unionJoinDate,
              numOfChildren: existingParticipant.numOfChildren,
              children: existingParticipant.childs,
            });
          }
        } catch (error) {
          console.error("Error fetching participant:", error);
        }
      } else {
        newParticipants.push(participantDto);
      }
    }

    // Xử lý các participants đã "nghỉ hưu"
    for (const existingSID of existingSIDs) {
      try {
        const checkUnionMember = await this.prisma.participant.findUnique({
          where: { sID: existingSID },
        });

        if (!requestSIDs.includes(existingSID) && checkUnionMember?.isUnionMember === true) {
          const retiredParticipant = await this.prisma.participant.findUnique({
            where: { sID: existingSID },
            include: {
              achievements: true,
              childs: true,
              activities: true,
            },
          });

          if (retiredParticipant) {
            retireParticipants.push(retiredParticipant);
          }
        }
      } catch (error) {
        console.error("Error fetching retired participant:", error);
      }
    }
    if (invalidParticipants.length > 0) {
      throw new ValidationException({
        newParticipants,
        oldParticipants,
        invalidParticipants,
        retireParticipants,
      });
    }

    return { newParticipants, oldParticipants, invalidParticipants, retireParticipants };
  }

  async reginastion_WorkingStatus(ids: string[]): Promise<{ updatedCount: number; failedIds: string[] }> {
    const failedIds: string[] = [];
    let updatedCount = 0;

    for (const id of ids) {
      try {
        const participant = await this.prisma.participant.findUnique({
          where: { id },
        });
        if (!participant) {
          failedIds.push(id);
          continue; 
        }
        await this.prisma.participant.update({
          where: { id },
          data: { workingStatus: "RESIGNATION" },
        });
        updatedCount++;
      } catch (error) {
        failedIds.push(id); 
      }
    }
    return { updatedCount, failedIds };
  }
}
