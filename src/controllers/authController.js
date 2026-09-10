const { supabase } = require('../config/supabase');

const iniciarSesion = async (email, password) => {
  // 1. Validar credenciales en la bóveda de Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw new Error('Correo o contraseña incorrectos');

  // 2. Buscar los datos, el rol y los PERMISOS en el esquema 'core'
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select(`
      id, 
      full_name, 
      user_roles (
        roles ( 
          name, 
          code,
          role_permissions (
            permissions ( code, action, module )
          )
        )
      )
    `)
    .eq('email', email)
    .single();

  if (userError) throw new Error('Usuario no configurado en el sistema core');

  // 3. Limpiar y aplanar los datos para que el Frontend de React los lea fácil
  const roles = [];
  let permisosBrutos = [];

  userData.user_roles.forEach(ur => {
    roles.push(ur.roles.name);
    if (ur.roles.role_permissions) {
      ur.roles.role_permissions.forEach(rp => {
        if (rp.permissions) {
          permisosBrutos.push(rp.permissions.code); // Ej: 'VER_KARDEX', 'CREAR_OC'
        }
      });
    }
  });

  // Filtramos permisos duplicados (por si un usuario tiene 2 roles con el mismo permiso)
  const permisosUnicos = [...new Set(permisosBrutos)];

  return {
    token: authData.session.access_token,
    usuario: {
      id: userData.id,
      nombre: userData.full_name,
      roles: roles,
      permisos: permisosUnicos // <-- ¡Aquí va la lista exacta de accesos!
    }
  };
};

module.exports = { iniciarSesion };