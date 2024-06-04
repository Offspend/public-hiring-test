import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(tap(data => {
                if (data === undefined || data === null) {
                    let errorMessage = 'Carbon footprint calculation not found ';

                    const request = context.switchToHttp().getRequest();
                    const params = request.params;
                    const query = request.query;

                    if (params.id) errorMessage += `with ID: ${params.id}`;
                    if (query && Object.keys(query).length > 0) {
                        const queryStr = Object.keys(query)
                            .map(key => `${key}: ${query[key]}`)
                            .join(', ');
                        errorMessage += `with following filters: [${queryStr}]`;
                    }

                    throw new NotFoundException(errorMessage);
                }
            }));
    }
}