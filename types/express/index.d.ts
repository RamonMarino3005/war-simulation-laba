declare namespace Express {
  interface Request {
    validatedBody: object;
    session?: {
      userId: string;
      email: string;
    };
    token?: string;
  }
}
