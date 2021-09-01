import config from '../../config'
import {Req, Resp, StaticDB, PetrolModel} from '@api/interfaces'
import { log } from 'x-utils-es/umd'
import messages from '../../messages'
export default class ApiController {
    staticDB: StaticDB
    petrolListItems: PetrolModel[] = []
    debug = config.debug

    constructor({  staticDB }) {
        this.staticDB = staticDB
    }

    petrolList(req: Req, res: Resp){
        this.staticDB.petrolList().then(d => {
            res.status(200).json({ response: d, code: 200 })
        }).catch(err => {
            res.status(200).json({ ...messages['002'] })
        })

    }
}

