const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const TABLA = 'notas';
module.exports = function (dbInyectada) {
    let db = dbInyectada;
    if (!db) {
        db = require('../../db/mysql')
    }
    function todos() {
        return db.todos(TABLA);
    }    
    function uno(id) {
        return db.uno(TABLA, id);
    }    
    function agregar(body) {
        return db.agregar(TABLA, body);
    }    
    function eliminar(body) {
        return db.eliminar(TABLA, body);
    }
    async function generarQRCode(id) {
        try {
            const nota = await db.uno('notas', id);
            if (!nota) {
                throw new Error('Nota no encontrada');
            }
            const datosParaQR = {
                titulo: nota.titulo,
                frase: nota.frase,  
                texto: nota.texto
            };
            const qrCode = await QRCode.toDataURL(JSON.stringify(datosParaQR));
            return qrCode;
        } catch (error) {
            throw new Error(`Error al generar el QR: ${error.message}`);
        }
    }
    

    return {
        todos,
        uno,
        agregar,
        eliminar,
        generarQRCode
    }
}