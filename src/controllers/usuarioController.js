const { supabase } = require('../config/supabase');

// Obtener lista para la tabla
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

// Crear usuario desde el modal
const crearUsuario = async (datos) => {
  // 1. Crear en la bóveda secreta de Supabase (requiere Service Role Key)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: datos.email,
    password: datos.password, 
    email_confirm: true
  });

  if (authError) throw new Error(authError.message);

  // 2. Guardar el perfil público en tu tabla 'users'
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([{
      username: datos.username,
      full_name: `${datos.name} ${datos.lastName}`, 
      email: datos.email,
      phone: datos.phone, 
      password_hash: 'ignorado_por_supabase', 
      is_active: datos.status === 'activo' 
    }])
    .select()
    .single();

  if (userError) throw new Error(userError.message);

  // 3. ASIGNACIÓN DE ROLES EN LA BASE DE DATOS
  if (datos.role) {
    const { data: roleData } = await supabase
      .from('roles')
      .select('id')
      .eq('name', datos.role) 
      .single();

    if (roleData) {
      await supabase
        .from('user_roles')
        .insert([{ user_id: userData.id, role_id: roleData.id }]);
    }
  }

  return userData;
};

// Alternar el estado (Activo/Inactivo) desde el Switch de la tabla
const alternarEstadoUsuario = async (datos) => {
  const isActive = datos.status === 'activo';

  const { data, error } = await supabase
    .from('users')
    .update({ is_active: isActive })
    .eq('id', datos.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  return data;
};

// Actualizar usuario completo (Perfil y Contraseña) desde el modal
const actualizarUsuario = async (datos) => {
  // 1. Actualizamos el perfil público en tu tabla 'users'
  const { data: userData, error: userError } = await supabase
    .from('users')
    .update({
      username: datos.username,
      full_name: `${datos.name} ${datos.lastName}`,
      phone: datos.phone,
      is_active: datos.status === 'activo'
    })
    .eq('id', datos.id)
    .select()
    .single();

  if (userError) throw new Error(userError.message);

  // 2. ACTUALIZACIÓN DE ROLES
  if (datos.role) {
    const { data: roleData } = await supabase
      .from('roles')
      .select('id')
      .eq('name', datos.role)
      .single();

    if (roleData) {
      // Borramos el rol antiguo del usuario y asignamos el nuevo
      await supabase.from('user_roles').delete().eq('user_id', userData.id);
      await supabase.from('user_roles').insert([{ user_id: userData.id, role_id: roleData.id }]);
    }
  }

  // 3. Si escribiste una nueva contraseña en el modal, la actualizamos en Supabase Auth
  if (datos.password && datos.password.trim() !== "") {
    // Buscamos el ID interno de Auth usando el correo del usuario
    const { data: authData } = await supabase.auth.admin.listUsers();
    const authUser = authData?.users?.find(u => u.email === datos.email);
    
    if (authUser) {
      // Reemplazamos la contraseña vieja por la nueva
      const { error: passError } = await supabase.auth.admin.updateUserById(
        authUser.id,
        { password: datos.password }
      );
      if (passError) console.error("Error al actualizar contraseña:", passError.message);
    }
  }

  return userData;
};

module.exports = { obtenerUsuarios, crearUsuario, alternarEstadoUsuario, actualizarUsuario };