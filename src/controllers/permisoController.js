const { supabase } = require('../config/supabase');

// Obtener todos los permisos agrupados por módulo
const obtenerPermisos = async () => {
  const { data, error } = await supabase
    .from('permissions')
    .select('id, code, name, module, action, description')
    .eq('is_active', true);
    
  if (error) throw new Error(error.message);
  return data;
};

// Asignar permisos a un rol específico
const actualizarPermisosRol = async (roleId, permissionIds) => {
  // 1. Borramos los permisos anteriores de este rol
  await supabase.from('role_permissions').delete().eq('role_id', roleId);
  
  // 2. Insertamos los nuevos
  if (permissionIds.length > 0) {
    const nuevosPermisos = permissionIds.map(permId => ({
      role_id: roleId,
      permission_id: permId
    }));
    
    const { error } = await supabase.from('role_permissions').insert(nuevosPermisos);
    if (error) throw new Error(error.message);
  }
  
  return { success: true, message: 'Permisos actualizados' };
};

module.exports = { obtenerPermisos, actualizarPermisosRol };