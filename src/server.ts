import config from './config'
import session from './express-sess'
import { env, listRoutes } from './utils'
import messages from './messages'
import fs from 'fs'
import { attention, log, onerror } from 'x-utils-es/umd'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import ejs from 'ejs'
import Authentication from './libs/ctrs/auth.ctr'
import apiRouter from './libs/routes/api.router'
import { StaticDB } from './libs/StaticDB'
const init = () => {
    const app = express()

    app.set('trust proxy', 1) // trust first proxy
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({ extended: true }))
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

    // ----- load authentication
    try {
        const auth = Authentication(app)
        auth.AppUseAuth()
    } catch (err) {
        onerror('[ServerAuth]', err)
        return
    }

    // init static db
    const staticDB = new StaticDB()

    // ----- load our app routes
    let api
    try {
        api = apiRouter(staticDB)
        app.use('/api', api)
    } catch (err) {
        onerror('[api]', err)
    }

    app.get('/', function(req, res) {
        res.status(200).json({ response: true })
    })

    app.use('/welcome', function(req, res) {
        return res.status(200).json({ success: true, message: 'works fine', url: req.url, available_routes: listRoutes(api.stack, '/api'), status: 200 })
    })

    // catch all other routes
    app.all('*', function(req, res) {
        res.status(400).json({ ...messages['001'], error: true })
    })

    // -------- handle errors
    // @ts-ignore
    app.use(function(error, req, res, next) {
        onerror(error)
        res.status(500).json({ error: true, ...messages['500'] })
    })

    // Initialize server
    const server = app.listen(config.port, function() {
        // @ts-ignore
       // const host = (server.address().address || '').replace(/::/, 'localhost')
        // @ts-ignore
       // const port = server.address().port
        attention(`server running on ${config.HOST}`)
        attention('api routes: ', listRoutes(api.stack, '/api'))
        attention(`environment: ${env()}`)
    })

    return { server, app }
}
init()
