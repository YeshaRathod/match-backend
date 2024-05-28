const { Server } = require("socket.io")
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
            socket.emit("receiveMessage", { message: "This is a reply from the server" });
        })


        socket.on("disconnect", () => {
            console.log("Client disconnected");

        });

    });

    return io;
};