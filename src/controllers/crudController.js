const { supabase } = require('../config/supabase');

// 1. LEER (GET) - Filtra por is_active y mapea a 'status' para React
const leerRegistros = async (tabla, columnas = '*') => {
  const { data, error } = await supabase
    .from(tabla)
    .select(columnas)
    .eq('is_active', true)
    .order('id', { ascending: true });
    
  if (error) throw new Error(error.message);
  
  // Traducir a lo que espera tu archivo types/masters.ts
  return data.map(item => ({
    ...item,
    status: item.is_active ? 'activo' : 'inactivo'
  }));
};

// 2. CREAR (POST)
const crearRegistro = async (tabla, datos) => {
  // Limpiamos 'status' y aseguramos que is_active sea true
  const { status, ...datosLimpios } = datos;
  datosLimpios.is_active = true;

  const { data, error } = await supabase.from(tabla).insert([datosLimpios]).select().single();
  if (error) throw new Error(error.message);
  
  return { ...data, status: 'activo' };
};

// 3. ACTUALIZAR (PUT)
const actualizarRegistro = async (tabla, id, datos) => {
  const { status, ...datosLimpios } = datos;
  if (status) datosLimpios.is_active = (status === 'activo');

  const { data, error } = await supabase.from(tabla).update(datosLimpios).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  
  return { ...data, status: data.is_active ? 'activo' : 'inactivo' };
};

// 4. BORRAR (DELETE) - Borrado lógico usando is_active
const eliminarRegistro = async (tabla, id) => {
  const { data, error } = await supabase.from(tabla).update({ is_active: false }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { leerRegistros, crearRegistro, actualizarRegistro, eliminarRegistro };