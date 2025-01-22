const auth = require('../autenticacion');
module.exports = function checkAuth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
    try {
        const decoded = auth.verificarToken(token.split(' ')[1]);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

