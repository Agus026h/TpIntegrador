
const notFoundHandler = (req, res, next) => {
    res.status(404).render('404', {
        titulo: 'Página no encontrada',
        message: `La URL solicitada '${req.originalUrl}' no existe en nuestro servidor.`
    });
};

module.exports = notFoundHandler;