const EventEmitter = require("events");
const { Server } = require("socket.io")


const eventEmitter = new EventEmitter()
module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Update this with your frontend origin
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected");


        socket.on("sendMessage", (message) => {
            console.log(message)
            socket.broadcast.emit("receiveMessage", message)
            eventEmitter.emit("NEW_MESSAGE", message);
        })



        socket.on("disconnect", () => {
            console.log("Client disconnected");

        });

    });

    return { io, eventEmitter };
};