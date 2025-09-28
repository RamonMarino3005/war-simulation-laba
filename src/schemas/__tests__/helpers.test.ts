import { z } from "zod";
import { formatError } from "../helpers.js";

describe("formatError", () => {
  const schema = z.object({
    name: z.string().min(3),
    age: z.number().min(0),
  });

  it("should format a ZodError correctly", () => {
    const invalidData = { name: "A", age: -5 };

    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatError(result.error);
      expect(formatted.properties).toHaveProperty("name");
      expect(formatted.properties).toHaveProperty("age");
      // The properties object should contain messages
      expect(formatted.properties.name).toHaveProperty("errors");
      expect(formatted.properties.age).toHaveProperty("errors");
    }
  });

  it("should return a structured tree of errors", () => {
    const invalidData = {};
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatError(result.error);
      expect(formatted.properties.name.errors).toBeDefined();
      expect(formatted.properties.age.errors).toBeDefined();
    }
  });
});
