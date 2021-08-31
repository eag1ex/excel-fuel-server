import config from './config';
import session from './src/libs/express-sess'
import { listRoutes } from './src/libs/utils'
import messages from './src/libs/messages'
import fs from 'fs'
import { log, onerror } from 'x-utils-es/umd'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import ejs from 'ejs'
const app = express()

app.set('trust proxy', 1) // trust first proxy
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.engine('html', (ejs as any).__express) // ejs.renderFile
app.set('view engine', 'html') // if we want to set default file extention, for example: .html, .md
app.set('views', config.viewsDir)
// app.set('views', path.join(config.viewsDir, 'admin'))
// static routes
// app.use('/login/', express.static(path.join(config.viewsDir, './admin')))
// app.use('/user/', express.static(path.join(config.viewsDir, './user-app')))
// save logged in session and manage expiry
session(app)


app.get('/', function(req, res) {
    res.status(200).json({ response: true })
})


// Initialize server
const server = app.listen(config.port, function() {
    // @ts-ignore
    const host = (server.address().address || '').replace(/::/, 'localhost')
    // @ts-ignore
    const port = server.address().port
    log(`running on http://${host}:${port}`)
})

export default { server, app }
