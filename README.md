# turbulent-test

Write a node/typescript service with a websocket interface to handle clients.
The service should allow you to send a command message to add an event reminder with a
name and a specific time. If the time is reached, the service should notify all connected clients
of the event.
The service state should persist data if it restarts.

No UI required.

Special notes: Architecture and test coverage will be reviewed.

## Running the app:
```
$ npm i && npm start
```

## Deploy with Travis:
Create the following env. variables on `HEROKU_API_KEY`, `HEROKU_APP_NAME`.
```
$ npm run deploy
```