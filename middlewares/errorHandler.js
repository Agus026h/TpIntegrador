const errorHandler = (err, req, res, next) => {
    
    console.error('Error capturado por errorHandler:', err.stack);

    
    const statusCode = err.statusCode || 500;

    
    res.status(statusCode).render('error', {
        titulo: `Error ${statusCode}`,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error inesperado. Por favor, intente de nuevo más tarde.',
        
    });
};

module.exports = errorHandler;