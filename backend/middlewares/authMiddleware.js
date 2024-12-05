const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async(req, res, next) => {
    const { authorization } = req.headers;
    const { accessToken } = req.cookies;

    console.log('Auth Headers:', {
        authorization,
        cookieToken: accessToken
    });

    const token = authorization?.split(' ')[1] || accessToken;

    if (!token) {
        console.log('No token found');
        return res.status(409).json({ error: 'Please Login First' });
    }

    try {
        const deCodeToken = await jwt.verify(token, process.env.SECRET);
        console.log('Decoded Token:', {
            role: deCodeToken.role,
            id: deCodeToken.id,
            path: req.path
        });
        
        req.role = deCodeToken.role;
        req.id = deCodeToken.id || deCodeToken._id;
        req.firstName = deCodeToken.firstName;
        req.lastName = deCodeToken.lastName;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(409).json({ error: 'Please Login' });
    }
};