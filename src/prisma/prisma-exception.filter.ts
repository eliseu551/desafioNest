import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter
  implements ExceptionFilter<Prisma.PrismaClientKnownRequestError>
{
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getHttpStatus(exception);

    response.status(status).json({
      statusCode: status,
      message: this.getMessage(exception),
      code: exception.code,
    });
  }

  private getHttpStatus(exception: Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.BAD_REQUEST;
    }
  }

  private getMessage(exception: Prisma.PrismaClientKnownRequestError) {
    if (exception.code === 'P2002') {
      return 'Registro já existe para o campo único informado.';
    }
    if (exception.code === 'P2025') {
      return 'Registro não encontrado.';
    }
    return exception.message;
  }
}
