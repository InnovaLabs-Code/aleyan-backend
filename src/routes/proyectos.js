const express = require('express');
const router = express.Router();
const crud = require('../controllers/crudController');

const mapToDB = (data) => {
  const mapped = { ...data };
  if (mapped.clientId !== undefined) { mapped.customer_id = mapped.clientId; delete mapped.clientId; }
  if (mapped.managerId !== undefined) { mapped.manager_id = mapped.managerId; delete mapped.managerId; }
  if (mapped.startDate !== undefined) { mapped.start_date = mapped.startDate; delete mapped.startDate; }
  if (mapped.endDate !== undefined) { mapped.end_date = mapped.endDate; delete mapped.endDate; }
  return mapped;
};

const mapToFrontend = (row) => ({
  id: row.id,
  code: row.code,
  name: row.name,
  clientId: row.customer_id?.toString(),
  description: row.description,
  startDate: row.start_date,
  endDate: row.end_date,
  location: row.location,
  address: row.address,
  managerId: row.manager_id?.toString(),
  notes: row.notes,
  status: row.status // Proyectos guarda el estado como texto (Ej: planificado), no como booleano
});

const TABLA = 'projects';

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