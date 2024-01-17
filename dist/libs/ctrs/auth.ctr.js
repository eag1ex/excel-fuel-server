"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
var config_1 = (0, tslib_1.__importDefault)(require("../../config"));
var utils_1 = require("../../utils");
var umd_1 = require("x-utils-es/umd");
var messages_1 = (0, tslib_1.__importDefault)(require("../../messages"));
var ServerAuth = (function () {
    function ServerAuth(expressApp, routeName) {
        if (routeName === void 0) { routeName = '/api'; }
        this.debug = config_1.default.debug;
        this.expressApp = expressApp;
        this.routeName = routeName;
    }
    ServerAuth.prototype.makeSession = function (req) {
        var expiresNever = Math.round(new Date().getTime() / 1000) + 360000000000000000 * 100000000000;
        var authentication = {
            username: config_1.default.staticDB.username,
            password: config_1.default.staticDB.password,
            date: new Date(),
        };
        var token = jsonwebtoken_1.default.sign(authentication, config_1.default.secret, { expiresIn: expiresNever });
        req.session.accessToken = token;
        (0, umd_1.log)('new session made');
    };
    ServerAuth.prototype.checkCreds = function (req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var auth, validToken, token, err_1, withCreds;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auth = req.body || {};
                        validToken = false;
                        token = (0, utils_1.getToken)(req.headers) || (req.session || {}).accessToken;
                        if (!token) return [3, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, (0, utils_1.JWTverifyAccess)(jsonwebtoken_1.default, req, token)];
                    case 2:
                        validToken = (_a.sent()) === 'SESSION_VALID';
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        return [3, 4];
                    case 4:
                        if (!validToken && req.method !== 'POST') {
                            return [2, res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['000']))];
                        }
                        if (req.method === 'POST' && ['/auth', '/api/auth'].indexOf(req.url) !== -1) {
                            withCreds = [auth.username, auth.password].filter(function (n) { return !!n; }).length;
                            if (withCreds !== 2) {
                                return [2, res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['010']))];
                            }
                        }
                        if (!validToken) {
                            if (!(0, utils_1.validCreds)({ username: auth.username, password: auth.password })) {
                                return [2, res.status(400).json((0, tslib_1.__assign)({}, messages_1.default['000']))];
                            }
                            else {
                                this.makeSession(req);
                            }
                        }
                        (0, umd_1.attention)('[authorization][token]', token);
                        (0, umd_1.log)('[checkCreds][success]');
                        return [2, next()];
                }
            });
        });
    };
    ServerAuth.prototype.authNext = function (req, res, next) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token-expiry');
                res.header('Referrer-Policy', 'no-referrer');
                return [2, this.checkCreds(req, res, next)];
            });
        });
    };
    ServerAuth.prototype.AppUseAuth = function () {
        this.expressApp.use(this.routeName, this.authNext.bind(this));
    };
    return ServerAuth;
}());
exports.default = ServerAuth;
