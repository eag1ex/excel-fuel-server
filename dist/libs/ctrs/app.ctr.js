"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = (0, tslib_1.__importDefault)(require("../../config"));
var AppController = (function () {
    function AppController() {
        this.debug = config_1.default.debug;
    }
    AppController.prototype.app = function (req, res, next) {
        var asset = ['.jpg', '.png', '.ico', '.json', '.js', '.css', '.txt', '.map'].filter(function (n) {
            return n.indexOf(req.url) !== -1;
        }).length;
        if (asset)
            return next();
        else
            return res.render('../excel-fuel/index');
    };
    return AppController;
}());
exports.default = AppController;
