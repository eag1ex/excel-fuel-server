
 import path from 'path'
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
    apiRouter.get('/petrol/list', apiCtrs.petrolList.bind(apiCtrs))
    apiRouter.get('/petrol/item/:id', apiCtrs.petrolItem.bind(apiCtrs))
    apiRouter.post('/petrol/update/:id', apiCtrs.updatePetrol.bind(apiCtrs))
    apiRouter.post('/petrol/create', apiCtrs.createPetrol.bind(apiCtrs))
    apiRouter.get('/petrol/delete/:id', apiCtrs.deletePetrol.bind(apiCtrs))
    // apiRouter.get('/ping', apiCtrs.ping.bind(apiCtrs))

    // catch all other routes
    apiRouter.all('/*', function(req, res) {
        res.status(400).json({ ...messages['001'], error: true })
    })

    return apiRouter
}
