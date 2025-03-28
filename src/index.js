import dotenv from "dotenv"
import connectDB from "./db/index.js";
import express from "express"

const app = express()
dotenv.config({
    path: '../.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5500, () => {
        console.log(` server is running at port: ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("MONNGO db connection failed !!! ", error.message)
})






/*
import mongoose, { connect } from "mongoose";
import {DB_NAME} from "./constants"


import express from "express"
const app = express()

;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERROR: ", error)
            throw error.message 
        })

        app.listen(process.env.PORT, () => {
            console.log(`application is listeninng on port ${process.env.PORT}`)
        })

    } catch (error) {  
        console.error("ERROR: ", error)
        throw error.message 

    }
})()
*/