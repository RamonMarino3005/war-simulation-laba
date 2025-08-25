declare namespace Express {
  interface Request {
    validatedBody: object;
    user?: {
      userId: string;
      email: string;
    };
    token?: string;
  }
}
