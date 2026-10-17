const express = require('express');
const router = express.Router();
const crud = require('../controllers/crudController');

const mapToDB = (data) => {
  const mapped = { ...data };
  if (mapped.ruc !== undefined) { mapped.tax_id = mapped.ruc; delete mapped.ruc; }
  if (mapped.legalName !== undefined) { mapped.legal_name = mapped.legalName; delete mapped.legalName; }
  if (mapped.tradeName !== undefined) { mapped.trade_name = mapped.tradeName; delete mapped.tradeName; }
  if (mapped.contact !== undefined) { mapped.contact_name = mapped.contact; delete mapped.contact; }
  if (mapped.phone !== undefined) { mapped.contact_phone = mapped.phone; delete mapped.phone; }
  if (mapped.address !== undefined) { mapped.fiscal_address = mapped.address; delete mapped.address; }
  if (mapped.paymentTerms !== undefined) { mapped.payment_terms = mapped.paymentTerms; delete mapped.paymentTerms; }
  return mapped;
};

const mapToFrontend = (row) => ({
  id: row.id,
  code: row.code,
  ruc: row.tax_id,
  legalName: row.legal_name,
  tradeName: row.trade_name,
  contact: row.contact_name,
  phone: row.contact_phone,
  email: row.email,
  address: row.fiscal_address,
  city: row.city,
  country: row.country,
  paymentTerms: row.payment_terms,
  notes: row.notes,
  status: row.is_active ? 'activo' : 'inactivo'
});

const TABLA = 'suppliers'; // Sin prefijo 'core.'

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
    return res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;