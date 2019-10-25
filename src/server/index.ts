import * as express from "express"
import * as http from "http"
import * as socketio from "socket.io"

export class Server {
    public server: express.Application = express()
    public httpServer: http.Server

    public constructor(private port: string = "4000") {
        this.server.use(express.static("public"))
    }

    public start(): http.Server {
        console.log("Starting ./server ...")

        this.port = process.env.PORT || this.port
        this.httpServer = this.server.listen(this.port)

        console.log(`./server started and listening to port ${this.port}!`)

        return this.httpServer
    }
}

export class WebSocketServer {
    private connectedClients: socketio.Socket[] = []

    constructor(server: http.Server, public io = socketio(server)) { }

    public close() {
        return this.io.close()
    }

    public connect(socket: socketio.Socket) {
        this.connectedClients.push(socket)

        socket.on("disconnect", () => {
            this.disconnect(socket)
        })

        return this.connectedClients
    }

    public disconnect(socket: socketio.Socket) {
        console.log(`Disconnecting Socket { id: "${socket.id}" }`)
        if (this.connectedClients) {
            this.connectedClients.splice(this.connectedClients.findIndex((connectedSocket: socketio.Socket) => connectedSocket.id === socket.id), 1)
        }

        return this.connectedClients
    }

    public notifyAll(notification: INotification) {
        this.io.emit(notification.name, notification.data)
    }
}

interface INotification {
    name: string,
    data: any
}