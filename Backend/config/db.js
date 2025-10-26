const mongoose = require("mongoose")

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.mongo_URI)
        console.log("database connected")
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = connectDB


