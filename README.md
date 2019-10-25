# a-ws-service

A simple app that implements websocket using [socket.io](https://www.npmjs.com/package/socket.io) to handle event reminders.

Users can create event reminders in the app, and have all open connections notified at the specified time.

The app cleans its past events each day at 12 am (server time) and also during start.

## Running the app:
First install the app's dependencies running `$ npm i`, then:
```
$ npm run compile
$ npm start
```

## Test with jest:
Travis CI runs `$ npm test` after `$ npm install`, so it's reserved to transpile `.ts` to `.js`. Instead, run:
```
$ npm run jest
```

## Deploy with Travis:
Create the following env. variables on Travis CI: 
- `HEROKU_APP_NAME`: Run `$ heroku apps:info` to get app's name
- `HEROKU_API_KEY`: Run `$ travis encrypt $(heroku auth:token)` to get heroku's api key
```
$ npm run deploy
```