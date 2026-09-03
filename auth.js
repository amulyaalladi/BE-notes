const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./utils/config');

const auth = {
    isAuthenticated: async (request, response, next) => {
        try {
            const authHeader = request.headers.authorization;
            const cookieToken = request.cookies && request.cookies.token;

            let token = null;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            } else if (cookieToken) {
                token = cookieToken;
            }

            if (!token) {
                return response.status(401).json({ message: 'Authorization token required' });
            }

            const decodedToken = jwt.verify(token, JWT_SECRET);

            if (!decodedToken || !decodedToken.userId) {
                return response.status(401).json({ message: 'Invalid token' });
            }

            request.userId = decodedToken.userId;
            request.userRole = decodedToken.role || 'user';
            next();
        } catch (error) {
            return response.status(401).json({ message: 'error authenticating user' });
        }
    },
    allowRules: (roles = []) => {
        return (req, res, next) => {
            if (!Array.isArray(roles) || roles.length === 0) {
                return next();
            }

            const userRole = req.userRole || 'user';
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: 'no permission' });
            }

            next();
        };
    }
};

module.exports = auth;