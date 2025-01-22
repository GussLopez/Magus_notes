const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const router = express.Router();
router.get('/', todos);
router.get('/:id', uno);
router.post('/', agregar)
router.put('/', eliminar)
async function todos (req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
};
async function uno (req, res, next) {
    try {
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items, 200);    
    } catch (err) {
        next(err);
    }
};
async function agregar (req, res, next) {
    try {
        const items = await controlador.agregar(req.body);
        if (req.body.id == 0) {
            mensaje = 'Item guardado con exito';
        } else {
            mensaje = 'Item actualiado con exito';
        }
        respuesta.success(req, res, mensaje, 201);    
    } catch (err) {
        next(err);
    }
};
async function eliminar (req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Item eliminado exitosamente', 200);    
    } catch (err) {
        next(err);
    }
};

router.get('/:id/qrcode', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const nota = await controlador.uno(id);

        if (!nota) {
            return res.status(404).json({ error: true, message: 'Nota no encontrada' });
        }

        const QRCode = require('qrcode');
        const qrCodeData = await QRCode.toDataURL(JSON.stringify(nota[0].texto));
        
        res.json({ error: false, qrCode: qrCodeData });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Error al generar el QR', details: error.message });
    }
});
module.exports = router;