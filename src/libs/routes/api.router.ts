
 import { log } from 'x-utils-es/umd'
 import express from 'express'
 import messages from '../../messages'
 import ApiController from '../ctrs/api.ctr'

 export default (staticDB) => {

    const apiRouter = express.Router()


    // -------- Initialize our controllers
    const apiCtrs = new ApiController({staticDB})

    apiRouter.use(function timeLog(req, res, next) {
        log('Time: ', Date.now())
        next()
    })

    // ---------- set server routes
    apiRouter.get('/excel/stations', apiCtrs.excelStations.bind(apiCtrs))
    apiRouter.get('/excel/products', apiCtrs.excelProducts.bind(apiCtrs))
    apiRouter.get('/excel/item/:id', apiCtrs.excelItem.bind(apiCtrs))
    apiRouter.post('/excel/update/:id', apiCtrs.updateExcel.bind(apiCtrs))
    apiRouter.post('/excel/create', apiCtrs.createExcel.bind(apiCtrs))
    apiRouter.get('/excel/delete/:id', apiCtrs.deleteExcel.bind(apiCtrs))
    // apiRouter.get('/ping', apiCtrs.ping.bind(apiCtrs))

    // catch all other routes
    apiRouter.all('/*', function(req, res) {
        res.status(400).json({ ...messages['001'], error: true })
    })

    return apiRouter
}
