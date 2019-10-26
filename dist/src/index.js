"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const event_1 = require("./event");
const ws = new server_1.WebSocketServer(new server_1.Server().start());
ws.io.on("connection", async (socket) => {
    const ws_clients = ws.connect(socket);
    const sendUpcomingEvents = async () => ws.notifyAll({
        name: "upcoming-events",
        data: {
            events: await event_1.Event.getUpcomingEvents()
        }
    });
    console.log("Connected clients: ", ws_clients.map((v) => v.id));
    socket.emit("connected", { id: socket.id });
    await sendUpcomingEvents();
    socket.on("add-event", async (data) => {
        const event = new event_1.Event(data.name, data.dateTime);
        await event.save();
        await sendUpcomingEvents();
        event.beforeStart(async () => {
            ws.notifyAll({
                name: "event-notification",
                data: data
            });
            await sendUpcomingEvents();
        });
    });
});
//# sourceMappingURL=index.js.map