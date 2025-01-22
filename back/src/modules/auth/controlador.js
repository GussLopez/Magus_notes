const bcrypt = require('bcrypt');
const auth = require('../../autenticacion')
const TABLA = 'passwords';
module.exports = function (dbInyectada) {
    let db = dbInyectada;
    if (!db) {
        db = require('../../db/mysql')
    }
    async function login(usuario, password) {
        const data = await db.query(TABLA, {username: usuario});

        return bcrypt.compare(password, data.password)
            .then(resultado => {
                if (resultado === true) {
                    // Generar token
                    return auth.asignarToken(data);
                } else {
                    throw new Error("Información Invalida");
                }
            })
    }
    async function agregar(data) {
        const authData = {
            id: data.id,
        }
        if (data.username) {
            authData.username = data.username
        }
        if(data.password) {
            authData.password = await bcrypt.hash(data.password.toString(), 5);
        }

        return db.agregar(TABLA, authData);
    }
    return {
        agregar,
        login
    }
}