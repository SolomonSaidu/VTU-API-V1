import z from "zod";

const AirtimeSchema = z.object({
  network: z.enum(["1", "2", "3", "4"]), // MTN GLO 9MOBILE AIRTEL
  mobile_number: z
    .string()
    .regex(/^\d{11}$/, "Phone number must be 11 digit long."),
  Ported_number: z.enum(
    ["True", "False"],
    "Ported number should be a string of type (True/Fales).",
  ),
  amount: z
    .string("Amount must be a string.")
    .regex(/^\d+$/, "Amount must contain only numbers."),
  airtime_type: z.enum(["VTU"], "Airtime type should be a string."),
});

export { AirtimeSchema };
