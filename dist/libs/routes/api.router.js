"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var umd_1 = require("x-utils-es/umd");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var messages_1 = (0, tslib_1.__importDefault)(require("../../messages"));
var api_ctr_1 = (0, tslib_1.__importDefault)(require("../ctrs/api.ctr"));
exports.default = (function (staticDB) {
    var apiRouter = express_1.default.Router();
    var apiCtrs = new api_ctr_1.default({ staticDB: staticDB });
    apiRouter.use(function timeLog(req, res, next) {
        (0, umd_1.log)('Time: ', Date.now());
        next();
    });
    apiRouter.post('/auth', apiCtrs.excelAuth.bind(apiCtrs));
    apiRouter.get('/excel/stations', apiCtrs.excelStations.bind(apiCtrs));
    apiRouter.get('/excel/products', apiCtrs.excelProducts.bind(apiCtrs));
    apiRouter.post('/excel/update/:id', apiCtrs.updateExcel.bind(apiCtrs));
    apiRouter.post('/excel/create', apiCtrs.createExcel.bind(apiCtrs));
    apiRouter.get('/excel/delete/:id', apiCtrs.deleteExcel.bind(apiCtrs));
    apiRouter.all('/*', function (req, res) {
        res.status(400).json((0, tslib_1.__assign)((0, tslib_1.__assign)({}, messages_1.default['001']), { error: true }));
    });
    return apiRouter;
});
