//Modules & variables
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const cartModel = require("./cartModel");
const productModel = require("./productModel");
//Schema
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 30,
            required: true,
        },
        age: {
            type: Number,
            min: 10,
            max: 150,
            validate: function () {
                if (!this.value) this.value = 10;
            },
        },
        email: {
            type: String,
            trim: true,
            minLength: 3,
            maxLength: 30,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 150,
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        userType: {
            type: String,
            trim: true,
            enum: ["consumer", "vendor", "admin"],
            required: true,
        },
        image: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 300,
            default: "userDefault.png",
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                    unique: true,
                },
            },
        ],
        addresses: [
            {
                location: {
                    type: String,
                    trim: true,
                    minLength: 1,
                    maxLength: 500,
                    required: true,
                },
                phoneNumber: {
                    type: String,
                    trim: true,
                    minLength: 1,
                    maxLength: 20,
                    required: true,
                },
            },
        ],
        balance: {
            type: Number,
            min: 0,
            default: 0,
            validate: function () {
                if (!this.value) this.value = 0;
            },
        },
        actions: [
            {
                actionType: {
                    type: String,
                    trim: true,
                    enum: ["charge", "purchase"],
                    required: true,
                },
                value: {
                    type: Number,
                    min: 0,
                    required: true,
                },
                description: {
                    type: String,
                    maxLength: 300,
                    required: function () {
                        return this.actionType == "charge" ? true : false;
                    },
                },
                date: {
                    type: Date,
                    default: Date.now(),
                },
                cartId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: function () {
                        return this.actionType == "purchase" ? true : false;
                    },
                    ref: "carts",
                },
            },
        ],
    },
    { timeStamp: true }
);
//Virtual
userSchema.virtual("vendorProducts", {
    ref: "products",
    localField: "_id",
    foreignField: "vendorId",
});
//Pre
userSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
});
userSchema.pre("remove", async function () {
    //fs.unlinkSync(path.join(__dirname, "../../public", this.image))
    await productModule.removeAll({ userId: this._id });
});
//Post
userSchema.post("findOneAndDelete", async function (doc, next) {
    if (!doc) next();
    fs.unlinkSync(path.join(__dirname, "../../public", doc.image));
    await productModule.removeAll({ userId: doc._id });
});
//Methods
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.__v;
    delete user.tokens;
    return user;
};
userSchema.methods.generateToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.token);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};
userSchema.methods.changePic = async function (file) {
    const user = this;
    const oldPic = user.image === "userDefault.png" ? null : user.image;
    user.image = file.filename;
    await user.save();
    if (oldPic) fs.unlinkSync(path.join(__dirname, "../../public", oldPic));
};
userSchema.methods.addAddresses = async function (addresses) {
    addresses.forEach(address => {
        this.addresses = this.addresses.concat(address);
    });
    await this.save();
};
//Statics
userSchema.statics.checkPassword = function (password, hash) {
    return bcrypt.compare(password, hash);
};
userSchema.statics.login = async (email, password) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("Invalid Email");
    if (!userModel.checkPassword(password, user.password))
        throw new Error("Invalid Password");
    const token = await user.generateToken();
    return { user, token };
};
//Export
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
