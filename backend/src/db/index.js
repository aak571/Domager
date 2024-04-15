import mongoose from "mongoose"
import { cl } from "../utils/console.log.js"


/*********************This code is only if you are using Mongo DB database in your application***********************/
const connect_to_mongodb = async () => {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING)
        .then(() => {
            cl('Yes, mongoDB successfully connected')
        })
}

export { connect_to_mongodb }