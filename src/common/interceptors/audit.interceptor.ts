import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Audit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body } = request;
    const userId = request.user?.id;
    const started = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `user:${userId ?? 'anonymous'} ${method} ${originalUrl} in ${
            Date.now() - started
          }ms payload=${JSON.stringify(body ?? {})}`,
        );
      }),
    );
  }
}
