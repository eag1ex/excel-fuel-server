"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var messages = {
    _msg: {},
    set msg(v) {
        this._msg = v;
    },
    get msg() {
        return this._msg;
    },
};
messages.msg = (0, utils_1.onMessages)({
    500: ['Server error', '500'],
    '000': ['Wrong login details', '000'],
    '001': ['Route no available', '001'],
    '002': ['Problem with excel list', '002'],
    '003': ['No data provided', '003'],
    '004': ['Problem creating new item', '004'],
    '005': ['Invalid inputs: Name, Address, City, Price, or latitude/longitude', '004'],
    '006': ['No data provided to update', '006'],
    '007': ['Invalid inputs: Name, Price', '007'],
    '008': ['Problem deleting item', '008'],
    '009': ['Problem finding item', '009'],
    '010': ['No credentials', '010'],
});
exports.default = messages.msg;
