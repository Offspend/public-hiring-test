import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionLogger implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        this.logMessage(request, status, exception);

        response
            .status(status)
            .json({
                message: exception.message,
                error: exception.name,
                statusCode: status,
            });
    }

    private logMessage(request: any, status: number, exception: Error) {
        const message = `Error on ${request.path}`;
        const context = `method=${request.method} status=${status} error_name=${exception.name} error_message=${exception.message}`;

        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            Logger.error(
                message,
                exception.stack,
                context,
            );
        } else {
            Logger.warn(
                message,
                context,
            );
        }
    }
}