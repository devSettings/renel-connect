export type ErrorResponse = {
  success: false;
  error: string | Record<string, string[]>;
};

export type SuccessResponse<T = any> = {
  success: true;
  data: T;
};

export type ActionResponse<T = any> = ErrorResponse | SuccessResponse<T>;
