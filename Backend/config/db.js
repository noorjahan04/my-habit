const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1); // optional: stop server if DB connection fails
    }
};

module.exports = connectDB;
