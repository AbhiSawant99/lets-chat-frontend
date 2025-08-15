export interface IApiRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, string>;
  cookies?: Record<string, string>;
}
