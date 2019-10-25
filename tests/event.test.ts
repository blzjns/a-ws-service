import { Event } from "../src/event"

let testEvent: Event

beforeAll(() => {
    testEvent = new Event("test-event", new Date())
})

describe("Event object behavior", () => {
    it("retrieves upcoming events", async () => {
        const upcomingEvents = await Event.getUpcomingEvents()
        expect(upcomingEvents).toBeDefined()
    })

    it("saves the event object to the app db", async () => {
        const savedDoc = await testEvent.save()
        expect(savedDoc.ok).toBe(true)
    })

    it("runs a function before event start time", () => {
        expect(typeof testEvent.beforeStart).toBe("function")
    })
    it("deletes the event object from app db", async () => {
        const deletedDoc = await testEvent.delete()
        expect(deletedDoc).toBe(true)
    })
})