const express = require('express');
const router = express.Router();
const crud = require('../controllers/crudController');

const mapToDB = (data) => {
  const mapped = { ...data };
  if (mapped.warehouseId !== undefined) { mapped.warehouse_id = mapped.warehouseId; delete mapped.warehouseId; }
  if (mapped.status !== undefined) { mapped.is_active = mapped.status === 'activo'; delete mapped.status; }
  return mapped;
};

const mapToFrontend = (row) => ({
  id: row.id,
  code: row.code,
  name: row.name,
  warehouseId: row.warehouse_id?.toString(),
  kind: row.kind,
  description: row.description,
  status: row.is_active ? 'activo' : 'inactivo'
});

const TABLA = 'inventory_locations';

router.get('/', async (req, res) => {
  try {
    const lista = await crud.leerRegistros(TABLA, '*');
    return res.status(200).json({ success: true, data: lista.map(mapToFrontend) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevo = await crud.crearRegistro(TABLA, mapToDB(req.body));
    return res.status(201).json({ success: true, data: mapToFrontend(nuevo) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { id: idActualizar, ...datosActualizar } = req.body;
    const actualizado = await crud.actualizarRegistro(TABLA, idActualizar, mapToDB(datosActualizar));
    return res.status(200).json({ success: true, data: mapToFrontend(actualizado) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const idEliminar = req.query.id || req.body.id;
    await crud.eliminarRegistro(TABLA, idEliminar);
    return res.status(200).json({ success: true, message: 'Eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;