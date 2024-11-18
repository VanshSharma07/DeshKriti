const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async(req, res, next) => {
    const { authorization } = req.headers;
    const { accessToken } = req.cookies;

    const token = authorization?.split(' ')[1] || accessToken;

    if (!token) {
        return res.status(409).json({ error: 'Please Login First' });
    }

    try {
        const deCodeToken = await jwt.verify(token, process.env.SECRET);
        req.role = deCodeToken.role;
        req.id = deCodeToken.id;
        next();
    } catch (error) {
        return res.status(409).json({ error: 'Please Login' });
    }
};