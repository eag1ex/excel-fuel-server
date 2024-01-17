"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_session_1 = (0, tslib_1.__importDefault)(require("express-session"));
var config_1 = (0, tslib_1.__importDefault)(require("./config"));
exports.default = (function (app) {
    app.use((0, express_session_1.default)({
        cookie: {
            path: '/',
            httpOnly: false,
            maxAge: 2 * 48 * 60 * 60,
            sameSite: true
        },
        secret: config_1.default.secret,
        resave: false,
        saveUninitialized: true
    }));
});
