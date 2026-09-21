import z from "zod";

const airtimeSchema = z.object({
  frequency: z.enum(["ONCE", "MINUTLY", "DAILY", "MONTHLY"]),
  year: z.number(),
  month: z.number(),
  day: z.number(),
  hour: z.number(),
  minute: z.number(),
  type: z.enum(["AIRTIME", "DATA"]),
  network: z.enum(["1", "2", "3", "4"]),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be 11 digit long."),
  PortedNumber: z.enum(["True", "False"]),
  amount: z
    .string("Amount must be a string.")
    .regex(/^\d+$/, "Amount must contain only numbers."),
  airtimeType: z.enum(["VTU"]),
});

const dataSchema = z.object({
  frequency: z.enum(["ONCE", "MINUTLY", "DAILY", "MONTHLY"]),
  year: z.number(),
  month: z.number(),
  day: z.number(),
  hour: z.number(),
  minute: z.number(),
  type: z.enum(["AIRTIME", "DATA"]),
  network: z.enum(["1", "2", "3", "4"]),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be 11 digit long."),
  PortedNumber: z.enum(["True", "False"]),
  amount: z
    .string("Amount must be a string.")
    .regex(/^\d+$/, "Amount must contain only numbers."),
  airtimeType: z.enum(["VTU"]),
  plan: z.enum(["1", "2"]),
});

export { airtimeSchema, dataSchema };
