
import session from 'express-session';
// to replace with https://www.npmjs.com/package/cookie-session

import config from '../../config'
export default (app: any) => {
    app.use(session({
        cookie: {
            path: '/',
            httpOnly: false,
            maxAge: 2 * 48 * 60 * 60, // 3 days
            //  secure: true
            sameSite: true
        },
        secret: config.secret,
        resave: false, // don't save session if unmodified
        saveUninitialized: true
    }))
}
