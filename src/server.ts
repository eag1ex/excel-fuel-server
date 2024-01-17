import config from './config'
import session from './express-sess'
import { env, listRoutes } from './utils'
import messages from './messages'
import path from 'path'
import { attention, log, onerror } from 'x-utils-es/umd'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import ejs from 'ejs'
import Authentication from './libs/ctrs/auth.ctr'
import apiRouter from './libs/routes/api.router'
import appRouter from './libs/routes/app.router'
import { StaticDB } from './libs/StaticDB'

const init = () => {
    const app = express()

    app.set('trust proxy', 1) // trust  proxy
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(cors())

    app.engine('html', (ejs as any).__express) // ejs.renderFile
    app.set('view engine', 'html') // default file extension: .html
    app.set('views', config.viewsDir)
    app.set('views', path.join(config.viewsDir, 'excel-fuel'))
    // static mappings
    app.use( express.static(path.join(config.viewsDir, './excel-fuel')))
    app.use('/app/', express.static(path.join(config.viewsDir, './excel-fuel')))

    session(app)

    // NOTE assign auth only to /api/* routes
    // ----- load authentication
    try {
        const auth = new Authentication(app, '/api')
        auth.AppUseAuth()
    } catch (err) {
        onerror('[ServerAuth]', err)
        return
    }

    // init static db
    const staticDB = new StaticDB()

    // ----- load  /api routes
    let apiRoutes
    try {
        apiRoutes = apiRouter(staticDB)
        app.use('/api', apiRoutes)
    } catch (err) {
        onerror('[apiRoutes]', err)
    }

    // ----- load  /app routes
    let excelApp
    try {
        excelApp = appRouter()
        app.use('/app', excelApp)
    } catch (err) {
        onerror('[excelApp]', err)
    }

    app.get('/', function(req, res) {
        res.status(200).json({ response: true })
    })

    app.use('/welcome', function(req, res) {
        return res.status(200).json({ success: true, message: 'works fine', url: req.url, available_routes: listRoutes(apiRoutes.stack, '/api'), status: 200 })
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
        attention(`server running on ${config.HOST}`)
        attention('/api routes: ', listRoutes(apiRoutes.stack, '/api'))
        attention('/excelApp routes: ', listRoutes(excelApp.stack, '/app'))
        attention(`environment: ${env()}`)
    })

    return { server, app }
}
init()
