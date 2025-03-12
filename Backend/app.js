const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const product = require("./controller/productController");
const user = require("./controller/userController");


const app = express();
app.use(cors());
app.use(express.json())

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders: ["Contend-Type", "Authorization"]
    })
)

app.use("/api", product);
app.use("/api", user);

module.exports = app;