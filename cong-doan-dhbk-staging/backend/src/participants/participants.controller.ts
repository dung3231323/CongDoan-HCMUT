import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
} from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { Public } from "src/common/decorators";
import {
  CreateParticipantDto,
  CreateParticipantsDto,
} from "./dto/dto.participant";
import { FilterParticipantDto } from "./dto/dto.filterParticipant";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeleteBulkParticipantsDto, EditParticipantDto } from "./dto/dto.editParticipant";
import {BadRequestDto, ErrorResponseDto } from "./dto/dto.error"
import { CustomBadRequestFilter, CustomBadRequestFilter2, ValidationException, ValidationResultDto } from "./dto/dto.validation";
import { EditMultipleParticipantsDto } from "./dto/dto.editBulk";


@ApiTags("participant")
@Controller("participant")
@Public()/*
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
  }),
)*/
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @ApiResponse({
    status: 201,
    description: 'Lọc thành công !',
    schema: {
      example: {
"data": [
    {
      "id": "c2639bd4-5092-4cfc-a7be-8cb98b560544",
      "createdAt": "2024-08-14T06:47:59.239Z",
      "updatedAt": "2024-08-14T06:47:48.296Z",
      "isUnionMember": false,
      "dob": "2024-08-14T06:47:59.239Z",
      "email": "vana@gmail.com",
      "phone": "+012345678",
      "sID": "1234",
      "uID": null,
      "unionJoinDate": null,
      "familyName": "string",
      "givenName": "string",
      "gender": "MALE",
      "numOfChildren": 0,
      "workingStatus": null,
      "facultyName": "MT",
      "facultyId": "CSE",
      "unionDeptId": null
    }
  ],
  "total": 1
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Đã xảy ra lỗi',
    type: BadRequestDto
  })
  @Post("filter")
  async filterParticipants(
    @Body() filterParticipantsDto: FilterParticipantDto,
  ) {
    return this.participantsService.filterParticipants(filterParticipantsDto);
  }


  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Tìm thành công !',
    schema: {
      example: {
        "data": {
          "id": "0bc4f7b0-1823-4edf-b589-515dd15e3f1b",
          "createdAt": "2024-08-14T08:38:48.427Z",
          "updatedAt": "2024-08-14T10:08:11.117Z",
          "isUnionMember": false,
          "dob": "2024-08-14T08:38:48.427Z",
          "email": "string",
          "phone": "string",
          "sID": "S45sadada6",
          "uID": null,
          "unionJoinDate": null,
          "familyName": "string",
          "givenName": "string",
          "gender": "MALE",
          "numOfChildren": 0,
          "workingStatus": null,
          "facultyName": "MT",
          "facultyId": "CSE",
          "unionDeptId": null,
          "achievements": [],
          "childs": [],
          "activities": []
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 404,
        message: 'Người dùng với id 12345 không tồn tại',
        error: 'Not Found',
      },
    },
  })

  async getParticipantById(@Param('id') id: string) {
    const participant = await this.participantsService.getParticipantById(id);
    if (!participant) {
      throw new NotFoundException(`Participant with id ${id} not found`);
    }
    return participant;
  }

  @ApiResponse({
    status: 200,
    description: 'Tìm thành công !',
    schema: {
      example: {
        "data": {
          "data": [
            {
              "id": "c2639bd4-5092-4cfc-a7be-8cb98b560544",
              "createdAt": "2024-08-14T06:47:59.239Z",
              "updatedAt": "2024-08-14T06:47:48.296Z",
              "isUnionMember": false,
              "dob": "2024-08-14T06:47:59.239Z",
              "email": "vana@gmail.com",
              "phone": "+012345678",
              "sID": "1234",
              "uID": null,
              "unionJoinDate": null,
              "familyName": "string",
              "givenName": "string",
              "gender": "MALE",
              "numOfChildren": 0,
              "workingStatus": null,
              "facultyName": "MT",
              "facultyId": "CSE",
              "unionDeptId": null
            }
          ],
          "total": 1
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Danh sách người dùng rỗng',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 404,
        message: 'Người dùng với id 12345 không tồn tại',
        error: 'Not Found',
      },
    },
  })
  @Get("")
  async getAllParticipants() {
    return this.participantsService.getAllParticipants();
    
  }

  @ApiResponse({
    status: 201,
    description: 'Thêm người dùng thành công !',
    schema: {
      example: {
        "success": true,
        "participant": {
          "id": "e1a91f45-eb43-44b4-af0c-c9b23f9b1a41",
          "createdAt": "2024-08-14T08:24:12.124Z",
          "updatedAt": "2024-08-14T08:24:12.124Z",
          "isUnionMember": true,
          "dob": "2024-08-14T08:24:12.124Z",
          "email": "string",
          "phone": "string",
          "sID": "string",
          "uID": "string",
          "unionJoinDate": "2024-08-14T08:23:16.059Z",
          "familyName": "string",
          "givenName": "string",
          "gender": "MALE",
          "numOfChildren": 0,
          "workingStatus": "WORKING",
          "facultyName": "MT",
          "facultyId": "CSE",
          "unionDeptId": "CSE"
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Đã xãy ra lỗi',
  })
  @Post("create")
  async createParticipant(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantsService.createParticipant(createParticipantDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Chỉnh sử thành công !',
    schema: {
      example: {
        "data": {
          "id": "0bc4f7b0-1823-4edf-b589-515dd15e3f1b",
          "createdAt": "2024-08-14T08:38:48.427Z",
          "updatedAt": "2024-08-14T09:58:22.702Z",
          "isUnionMember": false,
          "dob": "2024-08-14T08:38:48.427Z",
          "email": "string",
          "phone": "string",
          "sID": "S100001",
          "uID": null,
          "unionJoinDate": null,
          "familyName": "string",
          "givenName": "string",
          "gender": "MALE",
          "numOfChildren": 0,
          "workingStatus": null,
          "facultyName": "MT",
          "facultyId": "CSE",
          "unionDeptId": null
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Thành viên với id 123 không tồn tại !',
    type: ErrorResponseDto,
    
  })
  @Patch("edit/:id")
  async editParticipant(
    @Param("id") id: string,
    @Body() editParticipantDto: EditParticipantDto,
  ) {
    return this.participantsService.updateParticipant(id, editParticipantDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Thêm người dùng thành công !',
    schema: {
      example: {
        "data" : [
          {
            "action": "created",
            "participant": {
              "id": "ff7cf1c9-c351-4fb0-8c89-b50307dfea7e",
              "createdAt": "2024-08-14T09:52:39.044Z",
              "updatedAt": "2024-08-14T09:52:39.044Z",
              "isUnionMember": true,
              "dob": "2024-08-14T09:52:39.044Z",
              "email": "string",
              "phone": "string",
              "sID": "string",
              "uID": "string",
              "unionJoinDate": "2024-08-06T08:24:39.428Z",
              "familyName": "string",
              "givenName": "string",
              "gender": "MALE",
              "numOfChildren": 0,
              "workingStatus": "WORKING",
              "facultyName": "MT",
              "facultyId": "CSE",
              "unionDeptId": "CSE"
            }
          },
          {
            "action": "created",
            "participant": {
              "id": "add2a6ee-8c8b-4a34-a27d-acbf35d64d05",
              "createdAt": "2024-08-14T09:52:39.151Z",
              "updatedAt": "2024-08-14T09:52:39.151Z",
              "isUnionMember": false,
              "dob": "2024-08-14T09:52:39.151Z",
              "email": "string",
              "phone": "string",
              "sID": "string",
              "uID": null,
              "unionJoinDate": null,
              "familyName": "string",
              "givenName": "string",
              "gender": "FEMALE",
              "numOfChildren": 0,
              "workingStatus": null,
              "facultyName": "MT",
              "facultyId": "CSE",
              "unionDeptId": null
            }
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Đã xãy ra lỗi',
  })
  @Post("create-bulk")
  
  async createAllParticipants(
    @Body() createParticipantsDto: CreateParticipantsDto,
  ) {
    return this.participantsService.createAllParticipants(
      createParticipantsDto,
    );
  }


  @ApiResponse({
    status: 200,
    description: 'Xóa thành công !',
  })
  @ApiResponse({
    status: 404,
    description: 'Thành viên với id 123 không tồn tại !',
    type: ErrorResponseDto,
    
  })
  @Delete('delete/:id')
  //@HttpCode(HttpStatus.NO_CONTENT)
  async deleteParticipant(@Param('id') id: string) {
   const par =  await this.participantsService.deleteParticipant(id);
    return { 
      data: par,
      message: "Xóa thành công !" };
  }

  
  @Patch('edit-bulk')
  @ApiBody({
    description: 'Danh sách các người tham gia cần chỉnh sửa',
    
    examples: {
      example1: {
        summary: 'Ví dụ về dữ liệu để cập nhật người tham gia',
        value:  { "participants": [
          {
           
            "familyName": "string",
            "givenName": "string",
            "email": "string",
            "phone": "string",
            "workingStatus": "WORKING",
            "sID": "S123456",
            "gender": "MALE",
            "isUnionMember": true,
            "uID": "U123456",
            "unionJoinDate": "2015-05-05",
            "numOfChildren": 2,
            "children": [
              {
                "id": "123",
                "familyName": "string",
                "givenName": "string",
                "dob": "2015-05-05",
                "gender": "MALE"
              },
              {
             
                "familyName": "string",
                "givenName": "string",
                "dob": "2015-05-05",
                "gender": "MALE"
              }
            ]
          },
          {
            
            "familyName": "string",
            "givenName": "string",
            "email": "string",
            "phone": "string",
            "sID": "S654321",
            "gender": "FEMALE",
            "isUnionMember": false
          }
        ]
      }
    }
  }
  })

  @ApiResponse({
    status: 200,
    description: 'Cập nhật hàng loạt không thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ !',
    type: ErrorResponseDto,
    
  })
  async editBulk(@Body() dto: EditMultipleParticipantsDto) {
    await this.participantsService.editBulkParticipants(dto);
    return { message: "Chỉnh sửa thành công !"};
  }

  @ApiBody({
    description: 'Xóa nhiều participants theo danh sách IDs',
    type: DeleteBulkParticipantsDto,
    examples: {
      example1: {
        summary: 'Ví dụ về danh sách IDs hợp lệ',
        value: {
          ids: ['12345', '67890', 'abcdef'], // Đây là ví dụ JSON mà bạn muốn hiển thị
        },
      },
    },
  })

  @ApiResponse({
    status: 201,
    description: 'Xóa hàng loạt thành công !',
  })
  @ApiResponse({
    status: 400,
    description: 'Một số id không tồn tại !',
    type: ErrorResponseDto,
    
  })
  
  @Delete('delete-bulk')
  async deleteBulkParticipants(
    @Body() deleteBulkParticipantsDto: DeleteBulkParticipantsDto
  ): Promise<{ message: string; success: string[]; failed: string[] }> {
    const ids = deleteBulkParticipantsDto.ids;
    const result = await this.participantsService.deleteBulkParticipants(ids);

    if (result.failed.length > 0) {
      throw new BadRequestException({
        message: 'Một số id không tồn tại !',
        success: result.success,
        failed: result.failed,
      });
    }

    return { message: 'Xóa hàng loạt thành công !', success: result.success, failed: [] };
  }

  
  @Post('validate')
  @UseFilters(CustomBadRequestFilter)
  async validateParticipants(@Body() createParticipantsDto: CreateParticipantsDto) {
    const { validParticipants, invalidParticipants, retireParticipants } = await this.participantsService.validateParticipants(createParticipantsDto);

    if (invalidParticipants.length > 0) {
      throw new ValidationException({
        validParticipants,
        invalidParticipants,
        retireParticipants
      });
    }

    return {
      message: 'All participants are valid',
      validParticipants,
      invalidParticipants: [],
      retireParticipants
    };
  }

  @ApiBody({
    description: 'Cập nhật trạng thái làm việc của nhiều participants',
    
    examples: {
      example1: {
        summary: 'Ví dụ về danh sách IDs hợp lệ',
        value: {
          ids: ['12345', '67890', 'abcdef'], // Đây là ví dụ JSON mà bạn muốn hiển thị
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cập nhật danh sách nghỉ hưu thành công !',
  })
  @ApiResponse({
    status: 400,
    description: 'Một số id không tồn tại  !',
  })
  @Patch('retire')
  async Retired_WorkingStatus(
    @Body() updateWorkingStatusDto: DeleteBulkParticipantsDto
  ): Promise<{ updatedCount: number; failedIds: string[] }> {
    return this.participantsService.retired_WorkingStatus(updateWorkingStatusDto.ids);
  }


  @Post('new_validate')
  @UseFilters(CustomBadRequestFilter2)
  async new_validateParticipants(@Body() participantsDto: CreateParticipantsDto) {
    const { newParticipants, oldParticipants,invalidParticipants, retireParticipants } = await this.participantsService.new_validateParticipants(participantsDto);

    if (invalidParticipants.length > 0) {
      
      throw new ValidationException({
        newParticipants,
        oldParticipants,
        invalidParticipants,
        retireParticipants
      });
    }

    
    return {
      message: 'All participants are valid',
      oldParticipants,
      newParticipants,
      invalidParticipants: [],
      retireParticipants
    };

    
  }


  @ApiBody({
    description: 'Cập nhật trạng thái làm việc của nhiều participants',
    
    examples: {
      example1: {
        summary: 'Ví dụ về danh sách IDs hợp lệ',
        value: {
          ids: ['12345', '67890', 'abcdef'], 
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cập nhật danh sách nghỉ việc thành công !',
  })
  @ApiResponse({
    status: 400,
    description: 'Một số id không tồn tại  !',
  })
  @Patch('resignation')
  async Resignation_WorkingStatus(
    @Body() updateWorkingStatusDto: DeleteBulkParticipantsDto
  ): Promise<{ updatedCount: number; failedIds: string[] }> {
    return this.participantsService.reginastion_WorkingStatus(updateWorkingStatusDto.ids);
  }

}
