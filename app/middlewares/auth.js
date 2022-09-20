//Require & Variables
const jwt = require("jsonwebtoken");
const userModel = require("../database/models/userModel");
const { sendMessage, sendError } = require("../handlers/sendMessage");

class Auth {
    //Check If The Login User Has The Login Token
    static auth = async (req, res, next) => {
        try {
            const token = req.header("Authorization").replace("bearer ", "");
            const user = await userModel.findOne({
                _id: jwt.verify(token, process.env.token)._id,
                "tokens.token": token,
            });
            if (!user) throw new Error("Invalid Authorization");
            req.user = user;
            req.token = token;
            next();
        } catch (e) {
            res.status(401).send(sendError(e));
        }
    };

    //Check If The Login User Is The Admin
    static authAdmin = async (req, res, next) => {
        if (req.user.userType != "admin")
            res.status(401).send(
                sendMessage(false, null, "This User Should Be Admin!")
            );
        next();
    };

    //Check If The Login User Is a Vendor
    static authVendor = async (req, res, next) => {
        if (!["admin", "vendor"].includes(req.user.userType))
            res.status(401).send(
                sendMessage(false, null, "This User Should Be Admin Or Vendor!")
            );
        next();
    };
}

module.exports = Auth;
