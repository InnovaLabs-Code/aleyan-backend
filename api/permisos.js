const { setCorsHeaders } = require('../src/middlewares/cors');
const { obtenerPermisos, actualizarPermisosRol } = require('../src/controllers/permisoController');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const permisos = await obtenerPermisos();
      return res.status(200).json({ success: true, data: permisos });
    }

    if (req.method === 'POST') {
      const { roleId, permissionIds } = req.body;
      const resultado = await actualizarPermisosRol(roleId, permissionIds);
      return res.status(200).json(resultado);
    }

    return res.status(405).json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};