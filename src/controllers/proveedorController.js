const { supabase } = require('../config/supabase');

const obtenerProveedores = async () => {
  // Traemos solo los proveedores activos, ordenados por nombre
  const { data, error } = await supabase
    .from('suppliers')
    .select('id, tax_id, legal_name, trade_name, email, phone, contact_name')
    .eq('is_active', true)
    .order('legal_name', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
};

const crearProveedor = async (datos) => {
  // Insertamos los datos mapeados exactamente como los pide tu script SQL
  const { data, error } = await supabase
    .from('suppliers')
    .insert([{
      tax_id: datos.ruc, // Documento fiscal
      legal_name: datos.razon_social,
      trade_name: datos.nombre_comercial,
      fiscal_address: datos.direccion,
      phone: datos.telefono,
      email: datos.correo,
      contact_name: datos.contacto
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { obtenerProveedores, crearProveedor };