const { setCorsHeaders } = require('../src/middlewares/cors');
const { iniciarSesion } = require('../src/controllers/authController');

module.exports = async (req, res) => {
  if (setCorsHeaders(req, res)) return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan credenciales' });
      }

      const datosAcceso = await iniciarSesion(email, password);
      return res.status(200).json({ success: true, data: datosAcceso });
      
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Método no permitido' });
};