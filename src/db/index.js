// import Mongoose from "mongoose";
// import { DB_NAME } from "../constants.js"
import mongoose from "mongoose";

// We tried to connect to the database and if not connecte then throw an error
// we are creating this as a model for a better organised use
// and we will exort this as needed 
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB conection FAILED: ", error);
        process.exit(1)
    }
}

export default connectDB