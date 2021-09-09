"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = (0, tslib_1.__importDefault)(require("../../config"));
var umd_1 = require("x-utils-es/umd");
var messages_1 = (0, tslib_1.__importDefault)(require("../../messages"));
var ApiController = (function () {
    function ApiController(_a) {
        var staticDB = _a.staticDB;
        this.debug = config_1.default.debug;
        this.staticDB = staticDB;
    }
    ApiController.prototype.excelAuth = function (req, res) {
        res.status(200).json({ response: { token: (req.session || {}).accessToken }, code: 200 });
    };
    ApiController.prototype.excelStations = function (req, res) {
        this.staticDB
            .excelStations()
            .then(function (n) {
            res.status(200).json({ response: n || [], code: 200 });
        })
            .catch(function (err) {
            (0, umd_1.onerror)('[excelStations]', err.toString());
            res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['002']));
        });
    };
    ApiController.prototype.excelProducts = function (req, res) {
        this.staticDB
            .excelProducts()
            .then(function (n) {
            res.status(200).json({ response: n || [], code: 200 });
        })
            .catch(function (err) {
            (0, umd_1.onerror)('[excelProducts]', err.toString());
            res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['002']));
        });
    };
    ApiController.prototype.createExcel = function (req, res) {
        var data = (0, umd_1.copy)(req.body);
        if ((0, umd_1.isFalsy)(data))
            return res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['003']));
        this.staticDB
            .createExcel(data)
            .then(function (n) {
            res.status(200).json({ response: n || null, code: 200 });
        })
            .catch(function (err) {
            (0, umd_1.onerror)('[createExcel]', err.toString());
            res.status(400).json({ code: '005', message: err.toString() });
        });
    };
    ApiController.prototype.updateExcel = function (req, res) {
        var id = req.params.id;
        var data = (0, umd_1.copy)(req.body);
        if ((0, umd_1.isFalsy)(data))
            return res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['006']));
        this.staticDB
            .updateExcelV2(id, data)
            .then(function (n) {
            res.status(200).json({ response: n || null, code: 200 });
        })
            .catch(function (err) {
            (0, umd_1.onerror)('[updateExcel]', err.toString());
            res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['007']));
        });
    };
    ApiController.prototype.deleteExcel = function (req, res) {
        var id = req.params.id;
        this.staticDB
            .deleteExcel([id])
            .then(function (n) {
            res.status(200).json({ response: n || [], code: 200 });
        })
            .catch(function (err) {
            (0, umd_1.onerror)('[deleteExcel]', err.toString());
            res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['008']));
        });
    };
    return ApiController;
}());
exports.default = ApiController;
