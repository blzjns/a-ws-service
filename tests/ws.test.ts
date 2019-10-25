import * as wsClientIO from "socket.io-client"
import { Server, WebSocketServer } from "../src/server"

const testEventTemplate = {
    name: "test-event",
    dateTime: new Date().toJSON()
}

const port = "6000"

let httpServer
let wsServer: WebSocketServer
let wsHost: string = `http://localhost:${[port]}`
let wsClient1: SocketIOClient.Socket
let wsClient2: SocketIOClient.Socket

beforeAll((done) => {
    httpServer = new Server(port).start()
    wsServer = new WebSocketServer(httpServer)

    wsClient1 = wsClientIO.connect(wsHost)
    wsClient2 = wsClientIO.connect(wsHost)

    done()
})

afterAll((done) => {
    wsServer.close()
    httpServer.close()

    done()
})

describe("websocket server client interaction", () => {
    it("ws client1 receives test event", (done) => {
        try {
            wsClient1.on("test-event", (data) => {
                expect(data).toEqual(testEventTemplate)
                done()
            })
        } catch (err) {
            done.fail(err)
        }
    })

    it("ws client2 receives test event", (done) => {
        try {
            wsClient2.on("test-event", (data) => {
                expect(data).toEqual(testEventTemplate)
                done()
            })
        } catch (err) {
            done.fail(err)
        }
    })

    setTimeout(() => {
        wsServer.io.emit("test-event", testEventTemplate)
    }, 100)
})