const express = require('express')
const dbConnect = require('./config/dbConnect')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000
const http = require('http')
const cors = require('cors')

const socketService = require('./services/socketService')

//------------------------------------------------------------------------cors middleware
app.use(cors())


const server = http.createServer(app)

const io = socketService(server)



dbConnect();     //connection with database
const authRouter = require('./routes/authRoutes')
const MoreAboutMeRouter = require('./routes/moreAboutMeRoutes')
const lifestyleRouter = require('./routes/lifestyleRoutes')
const profileRouter = require('./routes/profileRoutes')
const matchRouter = require('./routes/matchRoutes')
const cardRouter = require('./routes/cardRoutes')
const swipeRouter = require('./routes/swipeRoutes')
const chatRoomRouter = require('./routes/chatRoomRoutes')

const { errorHandler } = require('./middlewares/errorHandler')




//routes  ----middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api/user", authRouter)                //creating new user (create account)
app.use("/api/moreaboutme", MoreAboutMeRouter)       // more about me
app.use("/api/lifestyle", lifestyleRouter)           // lifestyle
app.use("/api/profile", profileRouter)               // Profile
app.use("/api/match", matchRouter)
app.use("/api/tinder", cardRouter)                 //  Match
app.use("/api/swipe", swipeRouter)
app.use("/api/chatroom", chatRoomRouter)



//error handling files 

app.use(errorHandler)
// app.use(notFound)



//app.use('/', (req, res) => res.send('Hello World!'))


server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

