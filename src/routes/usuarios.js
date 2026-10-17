const express = require('express');
const router = express.Router();
const { obtenerUsuarios, crearUsuario, alternarEstadoUsuario, actualizarUsuario } = require('../controllers/usuarioController');

// GET: Lista de usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    return res.status(200).json({ success: true, data: usuarios });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Nuevo usuario
router.post('/', async (req, res) => {
  try {
    const nuevoUsuario = await crearUsuario(req.body);
    return res.status(201).json({ success: true, data: nuevoUsuario, message: 'Usuario creado exitosamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Actualizar usuario completo o alternar estado rápido
router.put('/', async (req, res) => {
  try {
    // Si el objeto body trae la propiedad 'name', viene del Modal (Edición completa)
    if (req.body.name) {
      const usuarioActualizado = await actualizarUsuario(req.body);
      return res.status(200).json({ success: true, data: usuarioActualizado });
    } 
    // Si no trae 'name', es el Switch de la tabla (Estado rápido)
    else {
      const usuarioActualizado = await alternarEstadoUsuario(req.body); 
      return res.status(200).json({ success: true, data: usuarioActualizado });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;