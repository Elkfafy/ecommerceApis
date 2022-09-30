//Require & Variables
const userModel = require("../database/models/userModel");
const cartModel = require('../database/models/cartModel')
const { sendError, sendSuccess } = require("../handlers/sendMessage");
const fs = require("fs");
//User
class User {
    //All
    static register = async (req, res) => {
        try {
            const user = userModel(req.body);
            const token = await user.generateToken();
            if (req.file) {
                await user.changePic(req.file);
            }
            if (req.body.addresses) {
                await user.addAddresses(req.body.addresses);
            }
            res.status(200).send(
                sendSuccess({ user, token }, "user has been registered")
            );
        } catch (e) {
            res.status(400).send(sendError(e));
        }
    };
    static login = async (req, res) => {
        try {
            const data = await userModel.login(
                req.body.email,
                req.body.password
            );
            res.status(200).send(sendSuccess(data, "Login succeded"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static logout = async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter(t => t.token != req.token);
            await req.user.save();
            res.status(200).send(sendSuccess(req.user, "logged out"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static logoutAll = async (req, res) => {
        try {
            req.user.tokens = [];
            await req.user.save();
            res.status(200).send(sendSuccess(req.user, "logged out"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static changePic = async (req, res) => {
        try {
            if (!req.file) throw new Error("You Should send a Picture");
            req.user.changePic(req.file);
            res.status(200).send(
                sendSuccess(req.user, "profile picture changed")
            );
        } catch (e) {
            if (req.file) fs.unlinkSync(req.file.path);
            res.status(500).send(sendError(e));
        }
    };
    static editMe = async (req, res) => {
        try {
            for (let key in req.body) {
                if (key != "password" && req.body[key]) {
                    req.user[key] = req.body[key];
                }
            }
            if (req.file) await req.user.changePic(req.file);
            await req.user.save();
            res.status(200).send(sendSuccess(req.user, "Edited"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static changePass = async (req, res) => {
        try {
            if (
                !userModel.checkPass(
                    req.body.currentPassword,
                    req.user.password
                )
            )
                throw new Error("Wrong Current Password");
            req.user.password = req.body.password;
            await req.user.save;
            res.status(200).send(sendSuccess(req.user, "password changed"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static deleteMe = async (req, res) => {
        try {
            const data = await req.user.remove();
            if (!data) throw new Error("User Hasn't found");
            res.status(200).send(sendSuccess(data, "deleted"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static me = async (req, res) => {
        res.status(200).send(sendSuccess(req.user, "Data Fetched"));
    };
    static changeMyStatus = async (req, res) => {
        try {
            if (req.body.status === "activate") req.user.status = true;
            else req.user.status = false;
            await req.user.save();
            res.status(200).send(sendSuccess(req.user, "Status Changed"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static addAddress = async (req, res) => {
        try {
            req.user.addresses = req.user.addAddresses.concat(req.body);
            await req.user.save();
            res.status(200).send(sendSuccess(req.user, "address added"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static editAddress = async (req, res) => {
        try {
            const addressIndex = req.user.addresses.findIndex(
                address => address._id == req.params.id
            );
            req.user.addresses[addressIndex] = {
                ...req.body,
                _id: req.params.id,
            };
            await req.user.save();
            res.status(200).send(sendSuccess(req.user, "address edited"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static deleteAddress = async (req, res) => {
        try {
            req.user.addresses = req.user.addresses.filter(
                address => address._id == req.params.id
            );
            await req.user.save();
            res.status(200).send(sendSuccess(req.user, "address deleted"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static charge = async (req, res) => {
        const action = {
            actionType: "charge",
            value: req.body.balance,
            date: Date.now(),
        };
        try {
            console.log(typeof req.body.balance)
            req.user.balance += req.body.balance;
            action.description = `Charged Successfully`;
            req.user.actions = req.user.actions.concat(action);
            await req.user.save();
            res.status(200).send(sendSuccess(req.user, "charged"));
        } catch (e) {
            action.description = `Charged Failed`;
            req.user.actions = req.user.actions.concat(action);
            await req.user.save();
            res.status(500).send(sendError(e));
        }
    };
    static purchase = async (req, res) => {
        try {
            // req.body should have alist of products id , total price
            const cart = cartModel({ ...req.body, userId: req.user._id });
            const action = {
                actionType: "purchase",
                value: cart.totalPrice,
                date: Date.now(),
                cartId: cart._id,
            };
            req.user.actions = req.user.actions.concat(action);
            await req.user.save();
            await cart.save();
            res.status(200).send(sendSuccess(req.user, "Purchased"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    // Admin
    static all = async (req, res) => {
        try {
            const limit = req.query.limit;
            const page = req.query.page;
            const count = await userModel.count();
            const users = await userModel
                .find()
                .limit(limit)
                .skip(page * limit);
            res.status(200).send(sendSuccess({ users, count }, "all users"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static delete = async (req, res) => {
        try {
            const user = await userModel.findByIdAndDelete(req.params.id);
            if (!user) throw new Error("Invlid Id");
            res.status(200).send(sendSuccess(user, "deleted"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static edit = async (req, res) => {
        try {
            const user = await userModel.findByIdAndUpdate(req.params.id);
            if (!user) throw new Error("Invlid Id");
            res.status(200).send(sendSuccess(user, "updated"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static single = async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id);
            if (!user) throw new Error("Invlid Id");
            res.status(200).send(sendSuccess(user, "user found"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };

    static changeStatus = async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id);
            if (req.body.status === "activate") user.status = true;
            else user.status = false;
            await user.save();
            res.status(200).send(sendSuccess(user, "State Changed"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
}

//Export
module.exports = User;
