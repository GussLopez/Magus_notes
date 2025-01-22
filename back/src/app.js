const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const usuarios = require('./modules/usuarios/rutas');
const notas = require('./modules/notas/rutas');
const auth = require('./modules/auth/rutas');
const contacto = require('./modules/soporte/rutas');
const error = require('./red/errors');
const app = express();
// Middleware
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configuración
app.set('port', config.app.port);
// Rutas
app.use('/api/usuarios', usuarios);
app.use('/api/notas', notas);
app.use('/api/auth', auth);
app.use('/api/contacto', contacto);
app.use(error);
module.exports = app;

