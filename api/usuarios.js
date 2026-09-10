const { setCorsHeaders } = require('../src/middlewares/cors');
const { obtenerUsuarios, crearUsuario } = require('../src/controllers/usuarioController');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return res.status(200).end();

  try {
    // Si el frontend pide la lista de usuarios (GET)
    if (req.method === 'GET') {
      const usuarios = await obtenerUsuarios();
      return res.status(200).json({ success: true, data: usuarios });
    }

    // Si el frontend envía el formulario de nuevo usuario (POST)
    if (req.method === 'POST') {
      const nuevoUsuario = await crearUsuario(req.body);
      return res.status(201).json({ success: true, data: nuevoUsuario, message: 'Usuario creado exitosamente' });
    }

    return res.status(405).json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};