// Archivo: api/index.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Importar todas tus rutas desde la nueva carpeta
const almacenes = require('../src/routes/almacenes');
const areas = require('../src/routes/areas');
const categorias = require('../src/routes/categorias');
const clientes = require('../src/routes/clientes');
const formasPago = require('../src/routes/formas_pago');
const login = require('../src/routes/login');
const permisos = require('../src/routes/permisos');
const personal = require('../src/routes/personal');
const proveedores = require('../src/routes/proveedores');
const proyectos = require('../src/routes/proyectos');
const ubicaciones = require('../src/routes/ubicaciones');
const unidades = require('../src/routes/unidades');
const usuarios = require('../src/routes/usuarios');

// Registrar los endpoints para que el frontend los encuentre
app.use('/api/almacenes', almacenes);
app.use('/api/areas', areas);
app.use('/api/categorias', categorias);
app.use('/api/clientes', clientes);
app.use('/api/formas_pago', formasPago);
app.use('/api/login', login);
app.use('/api/permisos', permisos);
app.use('/api/personal', personal);
app.use('/api/proveedores', proveedores);
app.use('/api/proyectos', proyectos);
app.use('/api/ubicaciones', ubicaciones);
app.use('/api/unidades', unidades);
app.use('/api/usuarios', usuarios);

// Exportar la aplicación para Vercel
module.exports = app;