/**
 * @description ServerAuth extension
 */

import { Req } from '@api/interfaces'
import { Express } from 'express'
import jwt from 'jsonwebtoken'

// const { log, warn, delay, attention, onerror } = require('x-utils-es/umd')
import config from '../../config'
import { getToken, JWTverifyAccess } from '../../utils'
import { Resp } from '../../interfaces/server.interface'
import { attention, log, warn } from 'x-utils-es/umd'
const ENV = config.env // development,production

class ServerAuth {
    debug = config.debug
    expressApp: any

    constructor(expressApp: Express) {
        this.expressApp = expressApp
    }

    /**
     * @alwaysInSession
     * sets jtw token on `req.session.accessToken`
     */
    alwaysInSession(req) {
        ; (function set() {
            const expiresNever = Math.round(new Date().getTime() / 1000) + 360000000000000000 * 100000000000
            const authentication = {
                username: 'pl',
                password: 'pl',
                date: new Date(),
            }
            const token = jwt.sign(authentication, config.secret, { expiresIn: expiresNever })
            req.session.accessToken = token
        })()
         return this
    }

    /**
     * Check credentials on every request
     *
     */
    async checkCreds(req: Req, res: Resp, next: any) {
        // todo we will add our static token here

        //     const token = (req.session || {}).accessToken || getToken(req.headers)
        //     try {
        //         await JWTverifyAccess(jwt, req, token)
        //         log('[login][session]', 'still valid')
        //         return res.redirect(config.HOST + '/bucket/')
        //     } catch (err) {
        //         //
        //     }
        const auth = req.body || {}

        // if (!auth) {
        //     return res.status(400).json({ error: true, message: 'wrong auth provided!' })
        // }

        // if (auth.username.indexOf('pl') === -1 || auth.password.indexOf('pl') === -1) {
        //     return res.status(400).json({ error: true, message: 'wrong auth provided!' })
        // }

        // const authentication = {
        //     username: auth.username,
        //     password: auth.password,
        //     date: new Date(),
        // }

        // // we are sending the profile in the token
        // const token = jwt.sign(authentication, config.secret, { expiresIn: '30m' });
        // (req.session as any).accessToken = token

        // your "Authorization: Bearer {token}"
        attention('[header][authorization][token]', (req.session as any).accessToken)
        log('[checkCreds][success]')
        return next()

        // return res.redirect(config.HOST + '/bucket/')
    }

    async authCheck(req: Req, res: Resp, next: any) {
        this.alwaysInSession(req)

        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET')
        res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token-expiry')
        res.header('Referrer-Policy', 'no-referrer') // for google external assets

        return this.checkCreds(req, res, next)
    }

    AppUseAuth() {
        this.expressApp.use(this.authCheck.bind(this))
    }
}

export default (expressApp) => {
    return new ServerAuth(expressApp)
}
