const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const product = require("./controller/productController");
const user = require("./controller/userController");
const transaction = require("./controller/transactionController");

const app = express();
app.use(cors());
//app.use(express.json())
app.use(express.json({ limit: "50mb" })); // Increase the body size limit

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders: ["Contend-Type", "Authorization"]
    })
)

app.use("/api", product);
app.use("/api", user);
app.use("/api", transaction);

module.exports = app;