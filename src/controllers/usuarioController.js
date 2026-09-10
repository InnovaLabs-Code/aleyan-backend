const { supabase } = require('../config/supabase');

// Obtener lista para la tabla (image_3fb45a.png)
const obtenerUsuarios = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id, username, full_name, email, phone, is_active, last_login_at, created_at,
      user_roles ( roles ( name ) )
    `);
    
  if (error) throw new Error(error.message);
  return data;
};

// Crear usuario desde el modal (image_3fb475.png)
const crearUsuario = async (datos) => {
  // 1. Crear en la bóveda secreta de Supabase (requiere Service Role Key)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: datos.email,
    password: datos.password, // Se puede generar una por defecto: 'Aleyan2026*'
    email_confirm: true
  });

  if (authError) throw new Error(authError.message);

  // 2. Guardar el perfil público en tu tabla 'users'
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([{
      username: datos.username,
      full_name: `${datos.nombre} ${datos.apellidos}`,
      email: datos.email,
      phone: datos.telefono,
      password_hash: 'ignorado_por_supabase',
      is_active: datos.estado === 'Activo'
    }])
    .select()
    .single();

  if (userError) throw new Error(userError.message);

  return userData;
};

module.exports = { obtenerUsuarios, crearUsuario };