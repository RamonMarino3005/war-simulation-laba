import z, { ZodError } from "zod";

export function formatError<T>(error: ZodError<T>) {
  return z.treeifyError(error);
}
