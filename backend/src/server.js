import dotenv from 'dotenv'
import { connect_to_mongodb } from './db/index.js'
import { serve } from './app.js'
import { cl } from "./utils/console.log.js"

dotenv.config()

const mongoDB_connector = async () => {
    await connect_to_mongodb()
        .then(() => {
            try {
                serve.listen(process.env.SERVER_PORT, () => {
                    cl(`Server listening on port ${process.env.SERVER_PORT}.....`)
                })
            }
            catch (err) {
                cl(`Couldn't start the server as we faced an unexpected issue - ${err}`)
                process.exit(1)
            }
        })
        .catch(err => {
            cl(`Mongo DB connection failed - ${err}`)
            process.exit(1)
        })
}

mongoDB_connector()

export { serve }