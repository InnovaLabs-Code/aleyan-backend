const { setCorsHeaders } = require('../src/middlewares/cors');
const { obtenerUsuarios, crearUsuario, alternarEstadoUsuario, actualizarUsuario } = require('../src/controllers/usuarioController'); // Añade la función del PUT

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

    // Si el frontend cambia el estado Activo/Inactivo (PUT)
    // Si el frontend envía datos (PUT)
    if (req.method === 'PUT') {
      // Si el objeto body trae la propiedad 'name', significa que viene del Modal (Edición completa)
      if (req.body.name) {
        const usuarioActualizado = await actualizarUsuario(req.body);
        return res.status(200).json({ success: true, data: usuarioActualizado });
      } 
      // Si no trae 'name', significa que solo presionaste el Switch de la tabla (Estado rápido)
      else {
        const usuarioActualizado = await alternarEstadoUsuario(req.body); 
        return res.status(200).json({ success: true, data: usuarioActualizado });
      }
    }

    return res.status(405).json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};