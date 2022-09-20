// Requirements & Variables
require("dotenv").config();
require("./database/connection");
const express = require("express");
const app = express();
const userRoutes = require("../routes/userRoutes");
const productRoutes = require("../routes/productRoutes");
const categoryRoutes = require("../routes/categoryRoutes");

//Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("/public"));
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);

//Export
module.exports = app;
