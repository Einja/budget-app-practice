const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from the header
    const token = req.header('Authorization'); // Expecting the token in the 'Authorization' header
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add the decoded user info to the request object (usually contains the user ID)
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};