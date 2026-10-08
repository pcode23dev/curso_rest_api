import AppError from "../utils/AppError.js";

export default function validateMiddleware(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const erros = resultado.error.issues.map((erro) => ({
        campo: erro.path[0],
        mensagem: erro.message,
      }));

      throw new AppError(
        "Dados inválidos",
        400,
        erros
      );
    }

    req.body = resultado.data;

    next();

  };

}