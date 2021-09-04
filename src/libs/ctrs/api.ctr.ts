import config from '../../config'
import { Req, Resp, TStaticDB, PetrolModel, PetrolUpdate } from '@api/interfaces'
import { log, onerror, isFalsy, copy } from 'x-utils-es/umd'
import messages from '../../messages'
export default class ApiController {
    staticDB: TStaticDB
    petrolListItems: PetrolModel[] = []
    debug = config.debug

    constructor({ staticDB }) {
        this.staticDB = staticDB
    }

    /**
     * (GET) api/petrol/list
     * - no params
     * Return all available items from static db
     */
    petrolList(req: Req, res: Resp) {
        this.staticDB
            .petrolList()
            .then((n) => {
                res.status(200).json({ response: n, code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ ...messages['002'] })
            })
    }

    /**
     * (GET) api/petrol/item/:id
     * Return one petrol station by {id}
     */
    petrolItem(req: Req, res: Resp) {
        const id: string = req.params.id
        this.staticDB
            .petrolItemByID(id)
            .then((n) => {
                res.status(200).json({ response: n, code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ ...messages['009'] })
            })
    }

    /**
     * (POST) api/petrol/create
     * - body:PetrolModel (without {id, created_at, updated_at})
     * Return created item
     */
    createPetrol(req: Req, res: Resp) {
        const data: PetrolModel = copy(req.body)

        // Create, no data provided
        if (isFalsy(data)) return res.status(400).json({ ...messages['003'] })

        this.staticDB
            .createPetrolItem(data)
            .then((n) => {
                res.status(200).json({ response: n, code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ code: '005', message: err.toString() })
            })
    }

    /**
     * (POST) api/petrol/update/:id
     * - body: {name,price,product_id}
     * - updating {name,price}
     * Return updated petron/station by {id}
     */
    updatePetrol(req: Req, res: Resp) {
        const id: string = req.params.id
        const data: PetrolUpdate = copy(req.body)

        if (isFalsy(data)) return res.status(400).json({ ...messages['006'] })

        this.staticDB
            .updatePetrolItem(id, data)
            .then((n) => {
                res.status(200).json({ response: n, code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ ...messages['007'] })
            })
    }

    /**
     * (GET) api/petrol/delete/:id
     * - delete item from list by id
     * Return deteled items [id]
     */
    deletePetrol(req: Req, res: Resp) {
        const id: string = req.params.id
        this.staticDB
            .deletePetrolItems([id])
            .then((n) => {
                res.status(200).json({ response: n, code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ ...messages['008'] })
            })
    }
}
