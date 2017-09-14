var express = require('express');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var listUser = [];

io.on("connection", function (socket) {
    console.log("co ai do dang ket noi" + socket.id);

    socket.on("disconnect", function () {
        console.log(socket.id + " : ngat ke noi");
        listUser.splice(
            listUser.indexOf(socket.username), 1
        );
        socket.broadcast.emit("Server-send-listUser", listUser);
    });

    socket.on("Client-send-username", function (data) {
        // tra ve all
        // console.log(data);
        // return false;
        // io.sockets.emit("Server-send-data", data);
        if (listUser.indexOf(data) >= 0) {
            socket.emit("Server-send-dk-thatbai");
        } else {
            listUser.push(data);
            socket.username = data;
            socket.emit("Server-send-dk-thanhcong", data);
            // socket.broadcast.emit("Server-send-dk-thanhcong", socket.id + ' : ' + data);
            io.sockets.emit("Server-send-listUser", listUser);
        }
    });
    socket.on("Client-send-text", function (data) {
        io.sockets.emit("Server-send-text", {name:socket.username,text:data});
    });

    socket.on("Client-send-logout", function (data) {
        listUser.splice(
            listUser.indexOf(socket.username), 1
        );
        socket.broadcast.emit("Server-send-listUser", listUser);
    });
});


app.get("/", function (req, res) {
    res.render("trangchu");
});