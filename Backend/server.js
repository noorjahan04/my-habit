require('dotenv').config();
const express = require('express')
const connectDB = require('./config/db')
const authroutes = require("./routes/authroutes")
const Habitroutes = require('./routes/habitRoutes')
const habitlog = require('./routes/logroutes')
const goalroutes = require('./routes/goalRoutes')
const scheduler = require('./utils/scheduler')
const soulroutes = require("./routes/soulFuelRoutes")
const notificationroutes = require("./routes/notificationRoutes")
const analytics = require("./routes/analyticsRoutes")
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 4300
const cors = require('cors')
const path = require("path")
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors())

scheduler.init()
app.use('/soulfuel',soulroutes );
app.use('/notifications', notificationroutes);
app.use('/analytics', analytics)
app.use("/Goal" , goalroutes)
app.use("/habitLog" , habitlog)
app.use("/users" , authroutes)
app.use("/habit" , Habitroutes)
connectDB()
app.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`)
})








