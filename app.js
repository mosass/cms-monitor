import express from 'express'
import xmlparser from 'express-xml-bodyparser'
import cdrHandler from './cdr_reciever/cdr-handler.js'
import dbconn from './cdr-db/cdr-conn.js'

const app = new express()

app.use(express.json())
app.use(xmlparser())

app.use('/cdr-reciever', cdrHandler)

dbconn()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port${port}...`) )
