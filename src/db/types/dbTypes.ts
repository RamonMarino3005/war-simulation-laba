export interface DB_Controller {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
  init(): Promise<void>;
  close(): Promise<void>;
}
