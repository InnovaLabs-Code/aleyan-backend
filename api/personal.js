const { setCorsHeaders } = require('../src/middlewares/cors');
const crud = require('../src/controllers/crudController');

// Traductor de React (camelCase) a Supabase (snake_case)
const mapToDB = (data) => {
  const mapped = { ...data };

  if (mapped.kind !== undefined) { delete mapped.kind; }
  
  if (mapped.document !== undefined) { mapped.document_number = mapped.document; delete mapped.document; }
  if (mapped.firstName !== undefined) { mapped.first_name = mapped.firstName; delete mapped.firstName; }
  if (mapped.lastName !== undefined) { mapped.last_name = mapped.lastName; delete mapped.lastName; }
if (mapped.area !== undefined) { mapped.area_id = mapped.area; delete mapped.area; }
  
  if (mapped.status !== undefined) {
    mapped.is_active = mapped.status === 'activo';
    delete mapped.status;
  }
  
  return mapped;
};

// Traductor de Supabase a React
const mapToFrontend = (row) => ({
  id: row.id,
  code: row.code,
  document: row.document_number,
  firstName: row.first_name,
  lastName: row.last_name,
  position: row.position,
  area: row.area_id?.toString(),
  phone: row.phone,
  email: row.email,
  status: row.is_active ? 'activo' : 'inactivo'
});

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return res.status(200).end();

  const TABLA = 'personnel'; 
  const COLUMNAS = '*';

  try {
    switch (req.method) {
      case 'GET':
        const lista = await crud.leerRegistros(TABLA, COLUMNAS);
        return res.status(200).json({ success: true, data: lista.map(mapToFrontend) });

      case 'POST':
        const nuevo = await crud.crearRegistro(TABLA, mapToDB(req.body));
        return res.status(201).json({ success: true, data: mapToFrontend(nuevo) });
      case 'PUT':
        const { id: idActualizar, ...datosActualizar } = req.body;
        const actualizado = await crud.actualizarRegistro(TABLA, idActualizar, mapToDB(datosActualizar));
        return res.status(200).json({ success: true, data: mapToFrontend(actualizado) });

      case 'DELETE':
        const idEliminar = req.query.id || req.body.id;
        await crud.eliminarRegistro(TABLA, idEliminar);
        return res.status(200).json({ success: true, message: 'Eliminado' });

      default:
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};