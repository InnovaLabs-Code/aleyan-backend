const { supabase } = require('../config/supabase');

// 1. LEER (GET) - Acepta columnas personalizadas para tus alias de React
const leerRegistros = async (tabla, columnas = '*') => {
  const { data, error } = await supabase
    .from(tabla)
    .select(columnas)
    .eq('status', 'activo')
    .order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

// 2. CREAR (POST)
const crearRegistro = async (tabla, datos) => {
  const { data, error } = await supabase.from(tabla).insert([datos]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// 3. ACTUALIZAR (PUT)
const actualizarRegistro = async (tabla, id, datos) => {
  const { data, error } = await supabase.from(tabla).update(datos).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// 4. BORRAR (DELETE) - Borrado lógico
const eliminarRegistro = async (tabla, id) => {
  const { data, error } = await supabase.from(tabla).update({ status: 'inactivo' }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { leerRegistros, crearRegistro, actualizarRegistro, eliminarRegistro };