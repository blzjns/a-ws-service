"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const socketio = require("socket.io");
class Server {
    constructor(port = "4000") {
        this.port = port;
        this.server = express();
        this.server.use(express.static("public"));
    }
    start() {
        console.log("Starting ./server ...");
        this.port = process.env.PORT || this.port;
        this.httpServer = this.server.listen(this.port);
        console.log(`./server started and listening to port ${this.port}!`);
        return this.httpServer;
    }
}
exports.Server = Server;
class WebSocketServer {
    constructor(server, io = socketio(server)) {
        this.io = io;
        this.connectedClients = [];
    }
    close() {
        return this.io.close();
    }
    connect(socket) {
        this.connectedClients.push(socket);
        socket.on("disconnect", () => {
            this.disconnect(socket);
        });
        return this.connectedClients;
    }
    disconnect(socket) {
        console.log(`Disconnecting Socket { id: "${socket.id}" }`);
        if (this.connectedClients) {
            this.connectedClients.splice(this.connectedClients.findIndex((connectedSocket) => connectedSocket.id === socket.id), 1);
        }
        return this.connectedClients;
    }
    notifyAll(notification) {
        this.io.emit(notification.name, notification.data);
    }
}
exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=index.js.map