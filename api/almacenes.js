const { setCorsHeaders } = require('../src/middlewares/cors');
const crud = require('../src/controllers/crudController');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return res.status(200).end();

 const TABLA = 'warehouses';
const COLUMNAS = 'id, code, name, kind, description, address, responsibleId:responsible_id, status, notes';

  try {
    switch (req.method) {
      case 'GET':
        const lista = await crud.leerRegistros(TABLA, COLUMNAS);
        return res.status(200).json({ success: true, data: lista });
      case 'POST':
        const nuevo = await crud.crearRegistro(TABLA, req.body);
        return res.status(201).json({ success: true, data: nuevo });
      case 'PUT':
        const { id: idActualizar, ...datosActualizar } = req.body;
        const actualizado = await crud.actualizarRegistro(TABLA, idActualizar, datosActualizar);
        return res.status(200).json({ success: true, data: actualizado });
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