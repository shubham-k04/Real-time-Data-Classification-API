const express = require("express");
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io")

const userRoute = require("./routes/user");
const ruleRoute = require("./routes/rule");
const engine = require("./services/engine");
const { checkForAuthenticationCookie, socketConnectionAuthentication } = require("./middlewares/authentication");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("MongoDB connected succesfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

io.use(socketConnectionAuthentication());

io.on("connection", (socket) => {
    const email = socket.user.email;
    socket.on("message", async (message) => {
        const result = await engine(message, email);
        io.emit("result", {
            "result": result,
            "message": message,
        });
    });
    
});

app.get("/", (req, res) => {
    return res.render("home", {
        user: req.cookies[process.env.TOKEN_NAME],
        username: req.cookies["username"],
    });
});

app.use("/", userRoute);
app.use("/user", checkForAuthenticationCookie(process.env.TOKEN_NAME), ruleRoute);

const startServer = () => {
    try {
        const port = process.env.PORT;
        server.listen(port, () => {
            console.log(`Server started successfully on port: ${port}`);
        });
    } catch (err) {
        console.error("Error starting server: ", err);
    }
};

startServer();

// for testing
module.exports = app;