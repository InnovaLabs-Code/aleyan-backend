const { supabase } = require('../src/config/supabase');

module.exports = async (req, res) => {
  // Habilitar CORS para preflight de los navegadores
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Consulta de prueba a la base de datos
    const { data, error } = await supabase.from('currencies').select('*');

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: '¡Conexión exitosa al backend de Aleyan Core!',
      data: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al conectar con la base de datos',
      error: error.message
    });
  }
};