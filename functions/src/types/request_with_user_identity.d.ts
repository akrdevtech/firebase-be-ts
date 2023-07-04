declare global {
  namespace Express {
    interface Request {
      txId: string;
      rawBody?: string | Buffer;
    }
  }
}
export {};
