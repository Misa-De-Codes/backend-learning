require('dotenv').config()

const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send('musa loves coding')
})

app.get('/twitter', (req, res)=>{
    res.send("husa.com")
})

app.listen(process.env.PORT, ()=>{
    console.log(`Example app listening on port ${process.env.PORT}`)
})