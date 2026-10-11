const { supabase } = require('../config/supabase');

// Mapeo exacto entre tu frontend y tu base de datos
const ACTION_MAP = {
  'ver': 'LEER',
  'crear': 'CREAR',
  'editar': 'EDITAR',
  'eliminar': 'ELIMINAR',
  'exportar': 'EXPORTAR',
  'aprobar': 'APROBAR'
};

const REVERSE_ACTION_MAP = Object.fromEntries(
  Object.entries(ACTION_MAP).map(([k, v]) => [v, k])
);

// Obtener permisos y transformarlos en Matriz para el Frontend
const obtenerPermisosPorRol = async (rolNombre) => {
  // 1. Obtener ID del rol usando el nombre
  const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', rolNombre)
    .single();
    
  if (roleError || !roleData) throw new Error("Rol no encontrado");

  // 2. Obtener todos los permisos del sistema
  const { data: allPerms } = await supabase.from('permissions').select('*');

  // 3. Obtener los que este rol ya tiene asignados
  const { data: rolePerms } = await supabase
    .from('role_permissions')
    .select('permission_id')
    .eq('role_id', roleData.id);

  const assignedIds = rolePerms ? rolePerms.map(rp => rp.permission_id) : [];

  // 4. Armar la Matriz visual
  const matriz = {};
  allPerms.forEach(perm => {
    const module = perm.module;
    const frontAction = REVERSE_ACTION_MAP[perm.action] || perm.action.toLowerCase();
    
    if (!matriz[module]) matriz[module] = {};
    matriz[module][frontAction] = assignedIds.includes(perm.id);
  });

  return matriz;
};

// Recibir la Matriz del Frontend y guardarla como IDs en la BD
const actualizarPermisosRol = async (rolNombre, matriz) => {
  // 1. Obtener ID del rol
  const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', rolNombre)
    .single();
    
  if (roleError || !roleData) throw new Error("Rol no encontrado");

  // 2. Buscar todos los permisos para extraer sus IDs
  const { data: allPerms } = await supabase.from('permissions').select('id, module, action');

  // 3. Traducir la Matriz a una lista simple de IDs
  const permissionIds = [];
  for (const [module, actions] of Object.entries(matriz)) {
    for (const [action, isGranted] of Object.entries(actions)) {
      if (isGranted) {
        const dbAction = ACTION_MAP[action] || action.toUpperCase();
        const perm = allPerms.find(p => p.module === module && p.action === dbAction);
        if (perm) permissionIds.push(perm.id);
      }
    }
  }

  // 4. Borrar anteriores e insertar los nuevos (Tal como lo tenías planeado)
  await supabase.from('role_permissions').delete().eq('role_id', roleData.id);
  
  if (permissionIds.length > 0) {
    const nuevosPermisos = permissionIds.map(permId => ({
      role_id: roleData.id,
      permission_id: permId
    }));
    await supabase.from('role_permissions').insert(nuevosPermisos);
  }

  return { success: true, message: 'Permisos actualizados con éxito' };
};

module.exports = { obtenerPermisosPorRol, actualizarPermisosRol };