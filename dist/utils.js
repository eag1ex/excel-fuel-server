"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.validCreds = exports.JWTverifyAccess = exports.getToken = exports.onMessages = exports.excelItemUpdate = exports.excelItem = exports.validProductPair = exports.hasSpecialChar = exports.validLatLng = exports.uid = exports.listRoutes = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var umd_1 = require("x-utils-es/umd");
var config_1 = (0, tslib_1.__importDefault)(require("./config"));
var mongo_objectid_1 = (0, tslib_1.__importDefault)(require("mongo-objectid"));
var listRoutes = function (stack, appNameRoute) {
    return (0, lodash_1.reduce)(stack, function (n, el, k) {
        if (el.route) {
            if (((el.route || {}).path || '').indexOf('/') !== -1) {
                n.push({ route: appNameRoute ? "" + appNameRoute + el.route.path : el.route.path });
            }
        }
        return n;
    }, []);
};
exports.listRoutes = listRoutes;
var uid = function () {
    return new mongo_objectid_1.default().toString();
};
exports.uid = uid;
var validLatLng = function (lat, lng) {
    var isLatitude = function (num) { return isFinite(Number(num)) && Math.abs(Number(num)) <= 90; };
    var isLongitude = function (num) { return isFinite(Number(num)) && Math.abs(Number(num)) <= 180; };
    return isLatitude(lat) && isLongitude(lng);
};
exports.validLatLng = validLatLng;
var hasSpecialChar = function (str) {
    try {
        return /[\[\]\\,()?!%$@#~{}=^*_'"<>]/g.test(str);
    }
    catch (err) {
        return true;
    }
};
exports.hasSpecialChar = hasSpecialChar;
var validPricePair = function (pricePair) {
    if (isNaN(Number(pricePair.price)) || pricePair.price === '')
        return undefined;
    if (!pricePair.currency || !(0, umd_1.isString)(pricePair.currency))
        return undefined;
    if (!pricePair.product_id || !(0, umd_1.isString)(pricePair.product_id))
        return undefined;
    else
        return pricePair;
};
var validProductPair = function (prodPair) {
    if (!prodPair)
        return undefined;
    if (!prodPair.product_id)
        return undefined;
    if (prodPair.points.filter(function (n) { return n.id && n.status; }).length !== prodPair.points.length)
        return undefined;
    else
        return prodPair;
};
exports.validProductPair = validProductPair;
var excelItem = function (inputData) {
    var name = inputData.name, address = inputData.address, city = inputData.city, latitude = inputData.latitude, longitude = inputData.longitude, prices = inputData.prices, products = inputData.products;
    if ([name, address, city, latitude, longitude].filter(function (n) { return !(0, umd_1.isFalsy)(n); }).length !== 5) {
        return undefined;
    }
    var invalidMixed = [name, address, city].filter(function (n) { return (0, exports.hasSpecialChar)(n); }).length;
    var invalidProds = products.filter(function (n) { return !(0, exports.validProductPair)(n); }).length;
    var invalidPrices = prices.filter(function (n) { return !validPricePair(n); }).length;
    if (invalidMixed)
        return undefined;
    if (invalidProds && products.length)
        return undefined;
    if (invalidPrices || !(prices || []).length)
        return undefined;
    if (!(0, exports.validLatLng)(latitude, longitude))
        return undefined;
    return inputData;
};
exports.excelItem = excelItem;
var excelItemUpdate = function (inputData) {
    var name = inputData.name, prices = inputData.prices;
    if (!name)
        return undefined;
    if ((0, exports.hasSpecialChar)(name))
        return undefined;
    var invalidPrices = prices.filter(function (n) { return !validPricePair(n); }).length;
    if ((prices || []).length) {
        if (invalidPrices)
            return undefined;
    }
    return inputData;
};
exports.excelItemUpdate = excelItemUpdate;
var onMessages = function (messages) {
    var e_1, _a;
    var msgs = {};
    try {
        for (var _b = (0, tslib_1.__values)(Object.entries(messages)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = (0, tslib_1.__read)(_c.value, 2), k = _d[0], v = _d[1];
            msgs[k] = { message: v[0], code: v[1] };
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return msgs;
};
exports.onMessages = onMessages;
var getToken = function (headers) {
    if (headers === void 0) { headers = {}; }
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2)
            return parted[1];
        else
            return null;
    }
    return null;
};
exports.getToken = getToken;
var JWTverifyAccess = function (jwt, req, token) {
    var defer = (0, umd_1.sq)();
    if (!token)
        return Promise.reject('NO_TOKEN');
    else {
        jwt.verify(token, config_1.default.secret, function (err, decoded) {
            if (err) {
                (0, umd_1.onerror)('[JWTverifyAccess]', err.toString());
                defer.reject(err);
            }
            else {
                req.token = decoded;
                defer.resolve('SESSION_VALID');
            }
        });
    }
    return defer;
};
exports.JWTverifyAccess = JWTverifyAccess;
var validCreds = function (_a) {
    var username = _a.username, password = _a.password;
    return username === config_1.default.staticDB.username && password === config_1.default.staticDB.password;
};
exports.validCreds = validCreds;
var env = function () {
    if (process.env.EXCEL_APP === '1')
        return 'production';
    else
        return process.env.NODE_ENV;
};
exports.env = env;
