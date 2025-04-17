const mongoose = require("mongoose")

let dbConnection = null;

const connectionDB = async () => {

    try {
        if (!dbConnection) {

            dbConnection = await mongoose.connect(process.env.DB_URL);
            console.log("MongoDB Connected");
        }
        return dbConnection;
    } catch (error) {
        console.error("Error Connected To MongoDB : ", error);
        throw error;
    }
}

module.exports = connectionDB;