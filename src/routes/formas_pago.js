const express = require('express');
const router = express.Router();
const crud = require('../controllers/crudController');

const TABLA = 'payment_terms';

router.get('/', async (req, res) => {
  try {
    const lista = await crud.leerRegistros(TABLA, '*');
    return res.status(200).json({ success: true, data: lista });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevo = await crud.crearRegistro(TABLA, req.body);
    return res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { id: idActualizar, ...datosActualizar } = req.body;
    const actualizado = await crud.actualizarRegistro(TABLA, idActualizar, datosActualizar);
    return res.status(200).json({ success: true, data: actualizado });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const idEliminar = req.query.id || req.body.id;
    await crud.eliminarRegistro(TABLA, idEliminar);
    return res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;