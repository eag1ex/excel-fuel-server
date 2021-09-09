"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var utils_1 = require("./utils");
var port = Number(process.env.PORT || 5000);
exports.default = {
    debug: true,
    env: (0, utils_1.env)(),
    port: port,
    secret: 'r456thy67534987854998508we',
    HOST: process.env.EXCEL_APP === '1' ? 'https://pacific-meadow-55275.herokuapp.com/' : "http://localhost:" + port,
    viewsDir: path_1.default.join(__dirname, '../views'),
    staticDB: {
        username: 'eaglex',
        password: 'eaglex'
    }
};
