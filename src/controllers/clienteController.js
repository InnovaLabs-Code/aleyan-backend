const { supabase } = require('../config/supabase');

const obtenerClientes = async () => {
  // Traemos los clientes activos ordenados alfabéticamente
  const { data, error } = await supabase
    .from('customers')
    .select('id, tax_id, legal_name, trade_name, email, phone, contact_name')
    .eq('is_active', true)
    .order('legal_name', { ascending: true });
    
  if (error) throw new Error(error.message);
  return data;
};

const crearCliente = async (datos) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([{
      tax_id: datos.ruc, // RUC o DNI
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

module.exports = { obtenerClientes, crearCliente };