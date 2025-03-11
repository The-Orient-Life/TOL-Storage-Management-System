const app = require("./app");
const connectDB = require("./database/database");
require("dotenv").config();

connectDB();

const server = app.listen(process.env.PORT, () => {

    console.log(`App Running On ${process.env.PORT}`);
})
