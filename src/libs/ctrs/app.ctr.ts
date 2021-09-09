import config from '../../config'
import { Req, Resp } from '@api/interfaces';


export default class AppController {
    debug = config.debug

    constructor() {}

    /**
     * (GET) /app/
     * - this will go thru AppUseAuth pre/process
     * - body: {username,password} << using hardcoded credentials
     * returns valid {token}
     */
    app(req: Req, res: Resp, next) {
        const asset = ['.jpg', '.png', '.ico', '.json', '.js', '.css', '.txt', '.map'].filter((n) => {
            return n.indexOf(req.url) !== -1
        }).length
        if (asset) return next()
        else return res.render('../excelApp/index')
    }
}
