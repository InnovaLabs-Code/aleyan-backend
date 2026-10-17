const express = require('express');
const router = express.Router();
const { obtenerPermisosPorRol, actualizarPermisosRol } = require('../controllers/permisoController');

router.get('/', async (req, res) => {
  try {
    const { rol } = req.query; // Ejemplo: ?rol=Administrador General
    const matriz = await obtenerPermisosPorRol(rol);
    return res.status(200).json({ success: true, data: matriz });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { rol, permisos } = req.body;
    const resultado = await actualizarPermisosRol(rol, permisos);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;