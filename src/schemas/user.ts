import z, { ZodError } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters" })
    .max(15, { error: "Username must be at most 15 characters" }),
  email: z.email({ error: "Invalid Email" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

export function validateUserSchema(object: any) {
  return userSchema.safeParse(object);
}

export function validateLoginSchema(object: any) {
  return userSchema.omit({ username: true }).safeParse(object);
}

export function formatError<T>(error: ZodError<T>) {
  return z.treeifyError(error);
}
