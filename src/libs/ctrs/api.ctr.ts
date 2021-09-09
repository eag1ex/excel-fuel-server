import config from '../../config'
import { Req, Resp, TStaticDB, ExcelModel, Session } from '@api/interfaces'
import {  onerror, isFalsy, copy } from 'x-utils-es/umd'
import messages from '../../messages'
export default class ApiController {
    staticDB: TStaticDB
    debug = config.debug

    constructor({ staticDB }) {
        this.staticDB = staticDB
    }

    /**
     * (POST) api/auth/
     * - this will go thru AppUseAuth pre/process
     * - body: {username,password} << using hardcoded credentials
     * returns valid {token}
     */
    excelAuth(req: Req & { session?: Session }, res: Resp){

       //  const auth:AuthCredentials = req.body
        res.status(200).json({ response: {token: (req.session || {}).accessToken}, code: 200 })
    }

    /**
     * (GET) api/excel/stations
     * - no params
     * Return all available excel products from static db
     */
    excelStations(req: Req, res: Resp) {
        this.staticDB
            .excelStations()
            .then((n) => {
                res.status(200).json({ response: n || [], code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ ...messages['002'] })
            })
    }

    /**
     * (GET) api/excel/products
     * - no params
     * Return all available stations from static db
     */
    excelProducts(req: Req, res: Resp) {
        this.staticDB
            .excelProducts()
            .then((n) => {
                res.status(200).json({ response: n || [], code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ ...messages['002'] })
            })
    }



    /**
     * (POST) api/excel/create
     * - body:ExcelModel (without {id, created_at, updated_at})
     * Return created item
     */
    createExcel(req: Req, res: Resp) {
        const data: ExcelModel = copy(req.body)

        // Create, no data provided
        if (isFalsy(data)) return res.status(400).json({ ...messages['003'] })

        this.staticDB
            .createExcel(data)
            .then((n) => {
                res.status(200).json({ response: n || null, code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ code: '005', message: err.toString() })
            })
    }

    /**
     * (POST) api/excel/update/:id
     * - body: [{name,price,product_id}]
     * - updating {name,price}
     * Return updated petron/station by {id}
     */
    updateExcel(req: Req, res: Resp) {
        const id: string = req.params.id
        const data: ExcelModel = copy(req.body)

        if (isFalsy(data)) return res.status(400).json({ ...messages['006'] })

        this.staticDB
            .updateExcelV2(id, data)
            .then((n) => {
                res.status(200).json({ response: n || null, code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ ...messages['007'] })
            })
    }

    /**
     * (GET) api/excel/delete/:id
     * - delete item from list by id
     * Return deteled items [id]
     */
    deleteExcel(req: Req, res: Resp) {
        const id: string = req.params.id
        this.staticDB
            .deleteExcel([id])
            .then((n) => {
                res.status(200).json({ response: n || [], code: 200 })
            })
            .catch((err) => {
                onerror(err)
                res.status(400).json({ ...messages['008'] })
            })
    }
}
