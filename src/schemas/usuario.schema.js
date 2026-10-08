import { z } from "zod";

const usuarioSchema = z.object({
  nome: z.string().trim().min(1),
  idade: z
    .number()
    .int()
    .min(1)
    .max(125),
});

export default usuarioSchema;
