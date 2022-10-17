const jwt = require("jsonwebtoken")

function generateToken(user) {
    return jwt.sign({
        id: user._id, 
        email: user.email,
        username: user.username,
        verified: user.verified,
        role: user.role
    }, process.env.SECRET_KEY, {expiresIn: "5h"});
}
module.exports = {generateToken}