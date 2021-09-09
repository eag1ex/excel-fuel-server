"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var umd_1 = require("x-utils-es/umd");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var messages_1 = (0, tslib_1.__importDefault)(require("../../messages"));
var app_ctr_1 = (0, tslib_1.__importDefault)(require("../ctrs/app.ctr"));
exports.default = (function () {
    var appRouter = express_1.default.Router();
    var appCtrs = new app_ctr_1.default();
    appRouter.use(function timeLog(req, res, next) {
        (0, umd_1.log)('App Time: ', Date.now());
        next();
    });
    appRouter.get('/*', appCtrs.app.bind(appCtrs));
    appRouter.all('*', function (req, res) {
        res.status(400).json((0, tslib_1.__assign)((0, tslib_1.__assign)({}, messages_1.default['001']), { error: true }));
    });
    return appRouter;
});
