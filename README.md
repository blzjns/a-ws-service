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
Create `HEROKU_APP_NAME` env. variable on Travis CI. Run command `$ heroku apps:info` to get app's name.

Then, run `$ travis encrypt $(heroku auth:token) --add deploy.api_key` to get [`deploy.apy_key.secure`](./.travis.yml) added to the [.travis.yml](./.travis.yml) file.

Finally, run:
```
$ npm run deploy
```