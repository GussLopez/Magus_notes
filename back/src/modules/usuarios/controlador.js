const tabla = 'usuarios';
const auth = require('../../autenticacion');
const bcrypt = require('bcrypt');
const db = require('../../db/mysql');
const error = require('../../red/errors');

module.exports = function (dbInyectada) {
    let db = dbInyectada || require('../../db/mysql');
    async function listar() {
        return db.todos(tabla);
    }
    async function obtener(id) {
        return db.uno(tabla, id);
    }
    async function agregar(body) {
        const usuario = {
            nombre: body.nombre,
            apellido: body.apellido,
            correo: body.correo,
            telefono: body.telefono,
            password: await bcrypt.hash(body.password, 5)
        }
        const respuesta = await db.agregar(tabla, usuario);
        return {
            ...usuario,
            id: respuesta.insertId
        };
    }
    async function eliminar(id) {
        return db.eliminar(tabla, id);
    }
    async function login(correo, password) {
        const data = await db.query(tabla, { correo: correo });
        if (!data || data.length === 0) {
            throw error('Usuario no encontrado', 404);
        }
        const sonIguales = await bcrypt.compare(password, data.password);
        if (!sonIguales) {
            throw error('Contraseña incorrecta', 401);
        }
        return auth.asignarToken({ ...data });
    }
    return {
        listar,
        obtener,
        agregar,
        eliminar,
        login
    }
}

