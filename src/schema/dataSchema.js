import z from "zod";

const dataShema = z.object({
  network: z.enum(["1", "2", "3", "4"]), // MTN GLO 9MOBILE AIRTEL, //Add more from the api doc
  mobile_number: z
    .string()
    .regex(/^\d{11}$/, "Phone number must be 11 digit long."),
  Ported_number: z.enum(["True", "Fales"]),
  plan: z.enum(["1", "2"]),
  amount: z.string(),
});

export { dataShema };
