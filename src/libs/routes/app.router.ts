import { log } from 'x-utils-es/umd'
import express from 'express'
import messages from '../../messages'
import AppController from '../ctrs/app.ctr'

export default () => {
    const appRouter = express.Router()

    // -------- Initialize our controllers
    const appCtrs = new AppController()

    appRouter.use(function timeLog(req, res, next) {
        log('Time: ', Date.now())
        next()
    })

    appRouter.get('/app', appCtrs.app.bind(appCtrs))

    // catch all other routes
    appRouter.all('/*', function (req, res) {
        res.status(400).json({ ...messages['001'], error: true })
    })

    return appRouter
}
