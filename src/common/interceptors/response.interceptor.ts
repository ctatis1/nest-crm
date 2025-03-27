import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    
    return next.handle().pipe(
      map(data => {
        // Si la respuesta ya es un ApiResponse, la devolvemos tal cual
        if (data instanceof ApiResponse) {
          response.status(data.status);
          return data;
        }
        
        // Si no, creamos una respuesta exitosa con los datos
        const statusCode = response.statusCode || 200;
        const apiResponse = ApiResponse.success<T>(
          Array.isArray(data) ? data : [data],
          'Operación exitosa',
          statusCode
        );
        
        response.status(statusCode);
        return apiResponse;
      }),
    );
  }
} 