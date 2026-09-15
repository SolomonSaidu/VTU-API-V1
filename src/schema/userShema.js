import z from "zod";

const RegisterSchema = z.object({
  name: z
    .string({ message: "Name must be a string." })
    .min(2, { message: "Name must be 2 or more character long." })
    .max(28, { message: "Name is to long." }),
  email: z.email({ message: "Invalid email format." }),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be 11 digit long."),
  password: z
    .string("Password must be a string")
    .min(6, { message: "Password most be at least 6 character long." })
    .max(50, { message: "Password should not be greater than 20." }),
});

const LoginSchema = z.object({
  email: z.email({ message: "Invalid email format." }),
  password: z
    .string({ message: "password most be string" })
    .min(6, { message: "password most be at least 6 character long." })
    .max(50, { message: "Password should not be greater than 20." }),
});

export { RegisterSchema, LoginSchema };
