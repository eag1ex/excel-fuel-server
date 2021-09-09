
import path from 'path'
import { env } from './utils'
const port = Number(process.env.PORT || 5000)

export default {
    debug: true,
    env: env(), // development,production
    port,
    /** changing secret will void last session */
    secret: 'r456thy67534987854998508we',
    // NOTE {MY_APP} is a custom var set on heroku to distinguish between environments
    HOST: process.env.MY_APP === 'dbName' ? '' : `http://localhost:${port}`,

    /** static files location */
    viewsDir: path.join(__dirname, '../views'),

    // hardcoded credentials including the server /api/auth
    staticDB: {
        username: 'eaglex', // our default user
        password: 'eaglex' // insecure password, for demo only
    }
}
