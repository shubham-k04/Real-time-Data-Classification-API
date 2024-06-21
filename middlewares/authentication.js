const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
            return res.json({ error: "Please login first" });
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (err) {
            return res.json({ error: "Unknown user" });
        }
        
        return next();
    }
}

function socketConnectionAuthentication() {
    return (socket, next) => {
        const token = socket.handshake.query.token;

        if(!token) {
            return res.json({ error: "Please login first" });
        }

        try {
            const userPayload = validateToken(token);
            socket.user = userPayload;
        } catch (err) {
            return res.json({ error: "Unknown user" });
        }
        
        return next();
    }
}

module.exports = { 
    checkForAuthenticationCookie,
    socketConnectionAuthentication,
};