const express = require('express');
const router = express.Router();
const { iniciarSesion } = require('../controllers/authController');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan credenciales' });
    }

    const datosAcceso = await iniciarSesion(email, password);
    return res.status(200).json({ success: true, data: datosAcceso });
    
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
});

module.exports = router;