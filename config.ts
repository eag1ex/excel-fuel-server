
import path from 'path'
const port = Number(process.env.PORT || 5000)
const dbRemote = true // process.env.MY_APP === 'psl' // true/false


export default {

    // in production the authentication is enabled
    env: 'development', // development,production
    port,
    secret: '456thy67987899808',
    // NOTE {MY_APP} is a custom var set on heroku to distinguish between environments
    // to run app on local host in production, you need to rebuild it with localhost api
    HOST: process.env.MY_APP === 'dbName' ? '' : `http://localhost:${port}`,
    viewsDir: path.join(__dirname, './views'),
    mongo: {
        remote: dbRemote,
        defaultUser: 'johndoe' // our default user
    }
}
