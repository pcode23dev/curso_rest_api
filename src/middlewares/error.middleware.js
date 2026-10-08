export default function errorMiddleware(error, req, res, next) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        msg: error.message || "Erro interno do servidor",
        erros: error.details || undefined
    })
};