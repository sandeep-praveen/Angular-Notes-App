import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;
    const token = header.split('Bearer ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }
    jwt.verify(token, 'secret-key', (err, decoded) => {
        if (err) {
            console.log(err)
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token.' });
            } else {
                return res.status(401).json({ message: 'Failed to authenticate token.' });
            }
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;