const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const router = express.Router();
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', agregar);
router.put('/', eliminar);
router.post('/login', login);
async function listar(req, res, next) {
    try {
        const items = await controlador.listar();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}
async function obtener(req, res, next) {
    try {
        const items = await controlador.obtener(req.params.id);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}
async function agregar(req, res, next) {
    try {
        const items = await controlador.agregar(req.body);
        respuesta.success(req, res, items, 201);
    } catch (err) {
        next(err);
    }
}
async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body.id);
        respuesta.success(req, res, 'Item eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const token = await controlador.login(req.body.correo, req.body.password);
        respuesta.success(req, res, { token }, 200);
    } catch (err) {
        next(err);
    }
}
module.exports = router;

