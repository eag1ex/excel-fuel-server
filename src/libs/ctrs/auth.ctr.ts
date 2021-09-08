
/**
 * @description ServerAuth extension
 */

import { Req } from '@api/interfaces'
import { Express } from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { getToken, JWTverifyAccess, validCreds } from '../../utils'
import { Resp, Session } from '../../interfaces/server.interface'
import { attention, log } from 'x-utils-es/umd'
import messages from '../../messages'
// const ENV = config.env

class ServerAuth {
    debug = config.debug
    expressApp: any

    constructor(expressApp: Express) {
        this.expressApp = expressApp
    }

    /**
     * sets jtw token on `req.session.accessToken`
     */
    makeSession(req: Req & { session?: Session }): void {
        const expiresNever = Math.round(new Date().getTime() / 1000) + 360000000000000000 * 100000000000
        const authentication = {
            username: config.staticDB.username,
            password: config.staticDB.password,
            date: new Date(),
        }
        const token = jwt.sign(authentication, config.secret, { expiresIn: expiresNever })
        req.session.accessToken = token
        log('new session made')
    }

    /**
     * Check credentials on every request
     *
     */
    async checkCreds(req: Req & { session?: Session }, res: Resp, next: any) {

        let validToken = false
        // check headers first, if not available use the session
        const token = getToken(req.headers) || (req.session || {}).accessToken
        if (token) {
            try {
                validToken = (await JWTverifyAccess(jwt, req, token)) === 'SESSION_VALID'
            } catch (err) {
                // ups
            }
        }

        // only accept form credentials for POST requests
        if (!validToken && req.method !== 'POST'){
            return res.status(400).json({ ...messages['000'] })
        }

     
        // if session expired or invalid check if asking for user details
        if (!validToken) {
            const auth = req.body || {}
            if (!validCreds({ username: auth.username, password: auth.password })) {
                return res.status(400).json({ ...messages['000'] })

            } else {
                // credentials are correnct make new session
                this.makeSession(req)
            }
        }

        attention('[authorization][token]', token)
        log('[checkCreds][success]')
        return next()
    }

    async authNext(req: Req, res: Resp, next: any) {

        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET')
        res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token-expiry')
        res.header('Referrer-Policy', 'no-referrer') // for google external assets
        return next()
        return this.checkCreds(req, res, next)
    }

    AppUseAuth() {
        this.expressApp.use(this.authNext.bind(this))
    }
}

export default (expressApp) => {
    return new ServerAuth(expressApp)
}
