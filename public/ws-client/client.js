const socket = io.connect("http://localhost:4000")
const _todayDate = new Date()

socket.on("connected", (data) => {
    document.getElementById("clientId").innerHTML = data.id

    setMinHours()
})

socket.on("upcoming-events", (data) => {
    if (data.events.length > 0) {
        document.getElementById("events").innerHTML = `<ul>
            ${data.events.map(event => `<li>
                <b>${event.name}</b> at ${new Date(event.dateTime).toLocaleTimeString()} 
            </li>`).join("")}
        </ul>`
    }
})

socket.on("event-notification", (event) => {
    document.getElementById("lastevent-txt").innerHTML = `Last event: <br/><b>${event.name}</b> at ${new Date(event.dateTime).toLocaleTimeString()}`

    alert(`New event notification: ${JSON.stringify(event)}`)
})

function setMinHours() {
    const eventTimeHourDOM = document.getElementById("event-time-hour")
    eventTimeHourDOM.min = _todayDate.getHours()

    document.getElementById("event-time-minute").min = (eventTimeHourDOM.value == _todayDate.getHours())
        ? _todayDate.getMinutes()
        : 0
}

function cleanForm() {
    const domIDs = [
        "event-name",
        "event-time-hour",
        "event-time-minute"
    ]

    domIDs.forEach(id => {
        document.getElementById(id).value = ""
    })
}

function addEvent() {
    _todayDate.setHours(document.getElementById("event-time-hour").value, document.getElementById("event-time-minute").value, 0)

    const eventObj = {
        name: document.getElementById("event-name").value,
        dateTime: _todayDate
    }

    socket.emit("add-event", eventObj)

    cleanForm()
}