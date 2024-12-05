import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger, BadRequestException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { MESS_INTERNAL_SERVER_ERROR } from "../constants/activity.category";

export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
    constructor(private httpAdapterHost: HttpAdapterHost) { }

    catch(exception: any, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message:any = MESS_INTERNAL_SERVER_ERROR;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            if (exception instanceof BadRequestException && exception.getResponse().hasOwnProperty('message')) {
                // Kiểm tra xem có phải là lỗi validation không
                const response = exception.getResponse();
                if (response && typeof response === 'object' && 'message' in response) {
                    message = Array.isArray(response['message']) ? response['message'] : [response['message']];
                }
                else {
                    message = exception.message
                }
            } else {
                message = exception.message;
            }
        }

        this.logger.error(`Exception: ${exception.message}, status: ${status}, path: ${request.url}`);

        const responseBody = {
            statusCode: status,
            timeStamp: new Date().toISOString(),
            errorMessage: message,
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            //stacktrace: exception.stack
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, status);
    }
}
