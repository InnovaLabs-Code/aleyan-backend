const { setCorsHeaders } = require('../src/middlewares/cors');
const crud = require('../src/controllers/crudController');

// 1. Traductor: Convierte el formato de React (camelCase) al de Supabase (snake_case)
const mapToDB = (data) => {
  const mapped = { ...data };
  
  // Usamos !== undefined para que traduzca el campo incluso si está vacío ("")
  if (mapped.ruc !== undefined) { mapped.tax_id = mapped.ruc; delete mapped.ruc; }
  if (mapped.legalName !== undefined) { mapped.legal_name = mapped.legalName; delete mapped.legalName; }
  if (mapped.tradeName !== undefined) { mapped.trade_name = mapped.tradeName; delete mapped.tradeName; }
  if (mapped.contact !== undefined) { mapped.contact_name = mapped.contact; delete mapped.contact; }
  if (mapped.phone !== undefined) { mapped.contact_phone = mapped.phone; delete mapped.phone; }
  if (mapped.address !== undefined) { mapped.fiscal_address = mapped.address; delete mapped.address; }
  if (mapped.paymentTerms !== undefined) { mapped.payment_terms = mapped.paymentTerms; delete mapped.paymentTerms; }
  
  return mapped;
};

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return res.status(200).end();

  const TABLA = 'suppliers';
  // 2. Aquí traducimos de Supabase a React al momento de Leer (GET) usando el formato "alias:nombre_columna"
  const COLUMNAS = 'id, code, ruc:tax_id, legalName:legal_name, tradeName:trade_name, contact:contact_name, phone:contact_phone, email, address:fiscal_address, city, country, paymentTerms:payment_terms, is_active, notes';

  try {
    switch (req.method) {
      case 'GET':
        const lista = await crud.leerRegistros(TABLA, COLUMNAS);
        return res.status(200).json({ success: true, data: lista });
        
      case 'POST':
        // Traducimos antes de guardar
        await crud.crearRegistro(TABLA, mapToDB(req.body));
        return res.status(201).json({ success: true, data: req.body });
        
      case 'PUT':
        const { id: idActualizar, ...datosActualizar } = req.body;
        // Traducimos antes de actualizar
        await crud.actualizarRegistro(TABLA, idActualizar, mapToDB(datosActualizar));
        return res.status(200).json({ success: true, data: req.body });
        
      case 'DELETE':
        const idEliminar = req.query.id || req.body.id;
        await crud.eliminarRegistro(TABLA, idEliminar);
        return res.status(200).json({ success: true, message: 'Eliminado correctamente' });
        
      default:
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};