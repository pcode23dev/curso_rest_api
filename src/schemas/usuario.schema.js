import { z } from "zod";

const usuarioCriarSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "O nome é obrigatório."),

  idade: z
    .number()
    .int("A idade deve ser um número inteiro.")
    .min(1, "A idade deve ser maior que zero.")
    .max(125, "A idade não pode ser maior que 125."),
});

const usuarioAtualizarSchema = usuarioCriarSchema.partial();

const usuariosMiddlewares =  {
  usuarioCriarSchema,
  usuarioAtualizarSchema,
};

export default usuariosMiddlewares;