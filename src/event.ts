import * as PouchDB from "pouchdb"
PouchDB.plugin(require("pouchdb-find"))

const db = new PouchDB("db")

export class Event {
    private _event: IEvent

    public beforeStart = (beforeStartFn: any) => {
        const eventDelay = Math.abs(new Date(this.dateTime).getTime() - new Date().getTime())

        setTimeout(async () => {
            beforeStartFn()

            await this.delete()
        }, eventDelay)
    }

    constructor(public name: string, public dateTime: Date) {
        this._event = {
            _id: Date.now().toString(),
            name: this.name,
            dateTime: this.dateTime
        }
    }

    /**
     * @description Create new Event from JSON
     * @param data the JSON to `return new Event(data.name, data.dateTime)`
     */
    static fromData = (data: IEvent) => new Event(data.name, data.dateTime)

    static getUpcomingEvents = async (): Promise<IEvent[]> => {
        const foundUpcomingEvents = await db.find({
            selector: {
                dateTime: {
                    $gt: new Date()
                }
            }
        })

        return foundUpcomingEvents.docs as IEvent[]
    }

    /**
    * @description Saves `this._event` object to app db
    */
    save = async () => await db.put(this._event)
        .then(doc => {
            console.info(`Saved event '${this.name}' to app db`)

            return doc
        })
        .catch(err => {
            console.error(err)

            return err
        })

    /**
     * @description Deletes `this._event` object from app db
     */
    delete = async () => await db.remove(this._event._id, this._event._rev)
        .then(doc => doc)
        .catch(err => {
            if (err.reason == "deleted") {
                console.info(`Deleted event '${this.name}' from app db...`)
                return true
            }
            else {
                console.error(err)
                return err
            }
        })
}

export interface IEvent {
    _id?: string
    name: string
    dateTime: Date
    _rev?: any
}

/**
 * @description DB tasks
 * 
 * @function _ensureDbIndex Caches event name and dateTime to optimize query time
 * @function _removeOldEvents Deletes non deleted past events
 * 
 * TODO: As the app grows the DB tasks could become a separated backend-service
 * */
let _dbIndex
async function _ensureDbIndex() {
    _dbIndex = _dbIndex || await db.createIndex({
        index: {
            fields: ["name", "dateTime"]
        }
    })
}

function _removeOldEvents(delayTime: number) {
    const todayDate = new Date()
    const getNextDelayTime = () => {
        const nextCleaningDate = new Date(todayDate)
        nextCleaningDate.setDate(nextCleaningDate.getDate() + 1)
        nextCleaningDate.setHours(0, 0, 0)

        return delayTime || (nextCleaningDate.getTime() - todayDate.getTime())
    }

    setTimeout(async () => {
        const foundOldEvents = await db.find({
            selector: {
                dateTime: {
                    $lt: new Date()
                }
            }
        })

        for (const eventDoc of foundOldEvents.docs) {
            await db.remove(eventDoc._id, eventDoc._rev)
            console.info(`Deleted old event with id '${eventDoc._id}' from app db...`)
        }

        _removeOldEvents(getNextDelayTime())
    }, delayTime)
}

_ensureDbIndex()
_removeOldEvents(1)