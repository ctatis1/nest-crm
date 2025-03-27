export class ApiResponse<T> {
  success: boolean;
  information: T[];
  message: string;
  status: number;

  constructor(success: boolean, information: T[], message: string, status: number) {
    this.success = success;
    this.information = information;
    this.message = message;
    this.status = status;
  }

  static success<T>(data: T[], message = 'Operación exitosa', status = 200): ApiResponse<T> {
    return new ApiResponse<T>(true, data, message, status);
  }

  static error<T>(message: string, status: number, data: T[] = []): ApiResponse<T> {
    return new ApiResponse<T>(false, data, message, status);
  }
} 