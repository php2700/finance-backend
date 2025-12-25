import mongoose from "mongoose"
import { CONNECT_URI } from "../src/envconfig.js"

const ConnectDb = async () => {
    try {
        await mongoose.connect(CONNECT_URI)
        console.log("connected")
    } catch (error) {
        console.log(erro)
        process.exit(1)
    }

}

export default ConnectDb;