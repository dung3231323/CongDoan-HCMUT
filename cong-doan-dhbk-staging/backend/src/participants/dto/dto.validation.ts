import { validate, ValidationError } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateParticipantDto, CreateParticipantsDto } from './dto.participant';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { A } from '../participants.service';
import { PrismaService } from 'src/prisma/prisma.service';




export class ValidationResultDto {
  @ApiProperty({ type: [CreateParticipantDto], description: 'Danh sách participant hợp lệ' })
  validParticipants: CreateParticipantDto[];

  @ApiProperty({ 
    type: [ValidationError], 
    description: 'Danh sách participant không hợp lệ kèm theo lỗi' 
  })
  invalidParticipants: {
    participant: CreateParticipantDto,
    errors: ValidationError[],
  }[];
  retiredParticipants: typeof A 
}

export class ValidationException extends HttpException {
    constructor(private readonly validationResponse: any) {
      super(validationResponse, HttpStatus.BAD_REQUEST);
    }
  
    getResponse() {
      return this.validationResponse;
    }
  }

  @Catch(BadRequestException)
  export class CustomBadRequestFilter implements ExceptionFilter {
    constructor(private readonly prismaService: PrismaService) {}
  
    async catch(exception: BadRequestException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse() as any;
  
      // Lấy thông báo lỗi từ exception
      const errors: string[] = Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [];
  
      const participants = request.body.participants || [];
      const invalidParticipantsMap = new Map<string, { participant: any, errors: string[] }>();
  
      // Xử lý lỗi và ánh xạ với sID
      errors.forEach((msg: string) => {
        let sID = 'unknown';
        let cleanedMsg = msg;
        let participant: any = null;
  
        // Xử lý lỗi cho participant
        if (msg.startsWith('participants.')) {
          const parts = msg.split('.');
          const participantIndex = parseInt(parts[1], 10);
          participant = participants[participantIndex];
          sID = participant ? participant.sID : 'unknown';
          cleanedMsg = msg.replace(/^participants\.\d+\./, '');
        }
  
        // Xử lý lỗi cho children
        if (cleanedMsg.includes('children.')) {
          cleanedMsg = cleanedMsg.replace(/children\.\d+\./g, '');
        }
  
        if (sID !== 'unknown') {
          if (!invalidParticipantsMap.has(sID)) {
            invalidParticipantsMap.set(sID, { participant, errors: [] });
          }
          invalidParticipantsMap.get(sID)?.errors.push(cleanedMsg);
        }
      });
  
      // Chuyển đổi danh sách lỗi sang định dạng mong muốn
      const invalidParticipants = Array.from(invalidParticipantsMap.entries()).map(([sID, data]) => ({
        sID,
        participant: data.participant,
        errors: data.errors
      }));
  
      // Lấy danh sách tất cả participant với isUnionMember là true
      const allParticipants = await this.prismaService.participant.findMany({
        where: { isUnionMember: true },
      });
  
      // Danh sách sID từ request
      const participantIds = participants.map((p) => p.sID);
  
      // Lọc các participant trong cơ sở dữ liệu mà không có trong participants và có isUnionMember là true
      const retireParticipants = allParticipants.filter(
        (p) => !participantIds.includes(p.sID)
      );
  
      response.status(status).json({
        statusCode: status,
        validParticipants: participants.filter(p => !invalidParticipants.some(ip => ip.sID === p.sID)),
        invalidParticipants,
        retireParticipants
      });
    }
  }


/*
@Catch(BadRequestException)
export class CustomBadRequestFilter2 implements ExceptionFilter {
  constructor(private readonly prismaService: PrismaService) {}

  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse() as any;

    // Extract error messages
    const errors: string[] = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : [];

    const participants = request.body.participants || [];
    const invalidParticipantsMap = new Map<
      string,
      { participant: any; errors: string[] }
    >();

    // Process each error message
    errors.forEach((msg: string) => {
      let sID = 'unknown';
      let cleanedMsg = msg;
      let participant: any = null;

      // Handle participant-related errors
      if (msg.startsWith('participants.')) {
        const parts = msg.split('.');
        const participantIndex = parseInt(parts[1], 10);
        participant = participants[participantIndex];
        sID = participant ? participant.sID : 'unknown';
        cleanedMsg = msg.replace(/^participants\.\d+\./, '');
      }

      // Handle children-related errors
      if (cleanedMsg.includes('children.')) {
        cleanedMsg = cleanedMsg.replace(/children\.\d+\./g, '');
      }

      if (sID !== 'unknown') {
        if (!invalidParticipantsMap.has(sID)) {
          invalidParticipantsMap.set(sID, { participant, errors: [] });
        }
        invalidParticipantsMap.get(sID)?.errors.push(cleanedMsg);
      }
    });

    // Convert the map to an array of invalid participants
    const invalidParticipants = Array.from(invalidParticipantsMap.entries()).map(
      ([sID, data]) => ({
        participant: data.participant,
        errors: data.errors,
      }),
    );

    // Extract all sIDs from the request
    const participantIds = participants.map((p) => p.sID);
    
    // Fetch all existing participants along with their children
    const allParticipants = await this.prismaService.participant.findMany({
      where: { sID: { in: participantIds } },
      include: {
        childs: { // Ensure this matches your Prisma schema relation name
          select: {
            id: true,
            parentId: true,
            familyName: true,
            givenName: true,
            gender: true,
            dob: true,
            createAt: true,
            updateAt: true,
            deletedAt: true,
          },
        },
      },
    });

    // Create a set of existing sIDs for quick lookup
    const existingParticipantIds = new Set(allParticipants.map((p) => p.sID));

    // Filter out valid participants (excluding invalid ones)
    const validParticipants = participants.filter(
      (p) => !invalidParticipants.some((ip) => ip.participant.sID === p.sID),
    );

    // Separate valid participants into old and new
    const oldParticipants = validParticipants
      .filter((p) => existingParticipantIds.has(p.sID))
      .map((p) => {
        // Find the corresponding participant from the database
        const dbParticipant = allParticipants.find((ap) => ap.sID === p.sID);
        return {
          ...p,
          children: dbParticipant?.childs.map((child) => ({
            id: child.id,
            parentId: child.parentId,
            familyName: child.familyName,
            givenName: child.givenName,
            gender: child.gender,
            dob: child.dob,
            createAt: child.createAt,
            updateAt: child.updateAt,
            deletedAt: child.deletedAt,
          })) || [],
        };
      });

    const newParticipants = validParticipants.filter(
      (p) => !existingParticipantIds.has(p.sID),
    );
    const retireParticipants = participants.filter(p => !existingParticipantIds.has(p.sID));
    //const retireParticipants = (exceptionResponse as any).retireParticipants || [];
    console.log("fsdfsdsf", retireParticipants);
    response.status(status).json({
      statusCode: status,
      oldParticipants,
      newParticipants,
      invalidParticipants,
      retireParticipants,
    });
  }
}
*/

@Catch(BadRequestException)
export class CustomBadRequestFilter2 implements ExceptionFilter {
  constructor(private readonly prismaService: PrismaService) {}

  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse() as any;

    // Extract error messages
    const errors: string[] = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : [];

    const participants = request.body.participants || [];
    const invalidParticipantsMap = new Map<
      string,
      { participant: any; errors: string[] }
    >();

    // Process each error message
    errors.forEach((msg: string) => {
      let sID = 'unknown';
      let cleanedMsg = msg;
      let participant: any = null;

      // Handle participant-related errors
      if (msg.startsWith('participants.')) {
        const parts = msg.split('.');
        const participantIndex = parseInt(parts[1], 10);
        participant = participants[participantIndex];
        sID = participant ? participant.sID : 'unknown';
        cleanedMsg = msg.replace(/^participants\.\d+\./, '');
      }

      // Handle children-related errors
      if (cleanedMsg.includes('children.')) {
        cleanedMsg = cleanedMsg.replace(/children\.\d+\./g, '');
      }

      if (sID !== 'unknown') {
        if (!invalidParticipantsMap.has(sID)) {
          invalidParticipantsMap.set(sID, { participant, errors: [] });
        }
        invalidParticipantsMap.get(sID)?.errors.push(cleanedMsg);
      }
    });

    // Convert the map to an array of invalid participants
    const invalidParticipants = Array.from(invalidParticipantsMap.entries()).map(
      ([sID, data]) => ({
        participant: data.participant,
        errors: data.errors,
      }),
    );

    // Extract all sIDs from the request
    const participantIds = participants.map((p) => p.sID);

    // Fetch all participants with isUnionMember set to true
    const allParticipants = await this.prismaService.participant.findMany({
      where: { isUnionMember: true },
      include: {
        childs: { // Ensure this matches your Prisma schema relation name
          select: {
            id: true,
            parentId: true,
            familyName: true,
            givenName: true,
            gender: true,
            dob: true,
            createAt: true,
            updateAt: true,
            deletedAt: true,
          },
        },
      },
    });

    // Filter out participants that are not in the request
    const retireParticipants = allParticipants.filter(
      (p) => !participantIds.includes(p.sID),
    );

    // Process valid participants
    const validParticipants = participants.filter(
      (p) => !invalidParticipants.some((ip) => ip.participant.sID === p.sID),
    );

    // Separate valid participants into old and new
    const oldParticipants = validParticipants
      .filter((p) => allParticipants.some((ap) => ap.sID === p.sID))
      .map((p) => {
        // Find the corresponding participant from the database
        const dbParticipant = allParticipants.find((ap) => ap.sID === p.sID);
        return {
          ...p,
          children: dbParticipant?.childs.map((child) => ({
            id: child.id,
            parentId: child.parentId,
            familyName: child.familyName,
            givenName: child.givenName,
            gender: child.gender,
            dob: child.dob,
            createAt: child.createAt,
            updateAt: child.updateAt,
            deletedAt: child.deletedAt,
          })) || [],
        };
      });

    const newParticipants = validParticipants.filter(
      (p) => !allParticipants.some((ap) => ap.sID === p.sID),
    );
    
    response.status(status).json({
      statusCode: status,
      oldParticipants,
      newParticipants,
      invalidParticipants,
      retireParticipants,
    });
  }
}




