"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticDB = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var umd_1 = require("x-utils-es/umd");
var config_1 = (0, tslib_1.__importDefault)(require("../../config"));
var messages_1 = (0, tslib_1.__importDefault)(require("../../messages"));
var StaticDB = (function () {
    function StaticDB(userName) {
        if (userName === void 0) { userName = config_1.default.staticDB.username; }
        this.userStaticExcelStations = {};
        this.staticExcelProducts = undefined;
        this.userName = userName;
        if (!this.userName) {
            (0, umd_1.onerror)('StaticDB requires {userName} but missing?');
        }
    }
    Object.defineProperty(StaticDB.prototype, "staticExcelStations", {
        get: function () {
            return this.userStaticExcelStations[this.userName];
        },
        set: function (val) {
            (0, umd_1.log)('staticExcelStations/database updated', (val || []).length);
            this.userStaticExcelStations[this.userName] = val;
        },
        enumerable: false,
        configurable: true
    });
    StaticDB.prototype.excelProducts = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                if (this.staticExcelProducts)
                    return [2, this.staticExcelProducts];
                try {
                    return [2, Promise.resolve().then(function () { return (0, tslib_1.__importStar)(require('./json/excel-products.json')); }).then(function (n) {
                            var list = n.default;
                            _this.staticExcelProducts = list;
                            return list;
                        })];
                }
                catch (err) {
                    return [2, Promise.reject(err)];
                }
                return [2];
            });
        });
    };
    StaticDB.prototype.excelStations = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                if (this.staticExcelStations)
                    return [2, Promise.resolve(this.staticExcelStations)];
                try {
                    return [2, Promise.resolve().then(function () { return (0, tslib_1.__importStar)(require('./json/excel-stations.json')); }).then(function (n) {
                            var list = n.default;
                            list = list.map(function (x) {
                                return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, x), { updated_at: new Date(), created_at: new Date() });
                            });
                            _this.userStaticExcelStations[_this.userName] = (0, umd_1.copy)(list);
                            return _this.userStaticExcelStations[_this.userName];
                        })];
                }
                catch (err) {
                    return [2, Promise.reject(err)];
                }
                return [2];
            });
        });
    };
    StaticDB.prototype.createExcel = function (data) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var exists, _a, _b, item, addressA, addressB, nData, err_1;
            var e_1, _c;
            return (0, tslib_1.__generator)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4, this.excelStations()];
                    case 1:
                        _d.sent();
                        if (!(0, utils_1.excelItem)(data))
                            throw new Error(messages_1.default['005'].message);
                        else {
                            exists = false;
                            try {
                                for (_a = (0, tslib_1.__values)(this.staticExcelStations), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    item = _b.value;
                                    if (item.latitude === data.latitude && data.longitude === item.longitude) {
                                        exists = true;
                                        break;
                                    }
                                    addressA = (item.address + item.city).toLowerCase();
                                    addressB = (data.address + data.city).toLowerCase();
                                    if ((0, umd_1.matched)(addressA, new RegExp(addressB, 'gi'))) {
                                        exists = true;
                                        break;
                                    }
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            if (exists) {
                                throw new Error('Item already exists, check your {address,latitude,longitude} properties');
                            }
                            nData = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, data), { id: (0, utils_1.uid)(), created_at: new Date(), updated_at: new Date() });
                            this.staticExcelStations.push(nData);
                            this.staticExcelStations = this.userStaticExcelStations[this.userName];
                            return [2, this.staticExcelStations[this.staticExcelStations.length - 1]];
                        }
                        return [3, 3];
                    case 2:
                        err_1 = _d.sent();
                        return [2, Promise.reject(err_1)];
                    case 3: return [2];
                }
            });
        });
    };
    StaticDB.prototype.updateExcelV2 = function (id, data) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var name_1, prices_1, updatedIndex_1, err_2;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.excelStations()];
                    case 1:
                        _a.sent();
                        if (!(0, utils_1.excelItemUpdate)(data))
                            throw new Error('updateExcel, Invalid data');
                        name_1 = data.name, prices_1 = data.prices;
                        this.staticExcelStations.forEach(function (item, inx) {
                            if (item.id === id) {
                                item.prices = prices_1;
                                item.name = name_1;
                                updatedIndex_1 = inx;
                            }
                        });
                        if (this.staticExcelStations[updatedIndex_1]) {
                            this.staticExcelStations = this.userStaticExcelStations[this.userName];
                            return [2, this.staticExcelStations[updatedIndex_1]];
                        }
                        else {
                            throw new Error("Did not update, id:" + id + " not found");
                        }
                        return [3, 3];
                    case 2:
                        err_2 = _a.sent();
                        return [2, Promise.reject(err_2)];
                    case 3: return [2];
                }
            });
        });
    };
    StaticDB.prototype.deleteExcel = function (ids) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var deletedItems, _loop_1, this_1, ids_1, ids_1_1, id, err_3;
            var e_2, _a;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!(ids || []).length)
                            throw new Error('deleteExcel, no ids provided');
                        ids = [].concat(ids);
                        ids = ids.filter(function (n) { return !!n; });
                        return [4, this.excelStations()];
                    case 1:
                        _b.sent();
                        deletedItems = [];
                        _loop_1 = function (id) {
                            var inxs = this_1.staticExcelStations.map(function (x, index) { return (x.id === id ? index : undefined); }).filter(function (x) { return x !== undefined; });
                            var deleted = 0;
                            inxs.forEach(function (dbIndex) {
                                _this.staticExcelStations.splice(dbIndex, 1);
                                deleted++;
                            });
                            if (deleted) {
                                deletedItems.push(id);
                                this_1.staticExcelStations = this_1.userStaticExcelStations[this_1.userName];
                            }
                        };
                        this_1 = this;
                        try {
                            for (ids_1 = (0, tslib_1.__values)(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
                                id = ids_1_1.value;
                                _loop_1(id);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) _a.call(ids_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        return [2, deletedItems];
                    case 2:
                        err_3 = _b.sent();
                        return [2, Promise.reject(err_3)];
                    case 3: return [2];
                }
            });
        });
    };
    return StaticDB;
}());
exports.StaticDB = StaticDB;
