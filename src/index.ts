import { Server, WebSocketServer } from "./server"
import { Event, IEvent } from "./event"

const ws = new WebSocketServer(new Server().start())
ws.io.on("connection", async (socket: SocketIO.Socket) => {
    const ws_clients = ws.connect(socket)
    const sendUpcomingEvents = async () => ws.notifyAll({
        name: "upcoming-events",
        data: {
            events: await Event.getUpcomingEvents()
        }
    })

    console.log("Connected clients: ", ws_clients.map((v: SocketIO.Socket) => v.id))

    socket.emit("connected", { id: socket.id })
    await sendUpcomingEvents()

    socket.on("add-event", async (data: IEvent) => {
        const event = new Event(data.name, data.dateTime)
        await event.save()

        await sendUpcomingEvents()

        event.beforeStart(async () => {
            ws.notifyAll({
                name: "event-notification",
                data: data
            })

            await sendUpcomingEvents()
        })
    })
})