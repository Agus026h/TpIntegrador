
const express = require('express');
const router = express.Router();

// Ruta de la página principal (Home)
router.get('/', (req, res) => {
  res.render('index', { titulo: 'Sistema Hospitalario HIS' });
});

module.exports = router;