"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = (0, tslib_1.__importDefault)(require("./config"));
var express_sess_1 = (0, tslib_1.__importDefault)(require("./express-sess"));
var utils_1 = require("./utils");
var messages_1 = (0, tslib_1.__importDefault)(require("./messages"));
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var umd_1 = require("x-utils-es/umd");
var express_1 = (0, tslib_1.__importDefault)(require("express"));
var morgan_1 = (0, tslib_1.__importDefault)(require("morgan"));
var body_parser_1 = (0, tslib_1.__importDefault)(require("body-parser"));
var cors_1 = (0, tslib_1.__importDefault)(require("cors"));
var ejs_1 = (0, tslib_1.__importDefault)(require("ejs"));
var auth_ctr_1 = (0, tslib_1.__importDefault)(require("./libs/ctrs/auth.ctr"));
var api_router_1 = (0, tslib_1.__importDefault)(require("./libs/routes/api.router"));
var app_router_1 = (0, tslib_1.__importDefault)(require("./libs/routes/app.router"));
var StaticDB_1 = require("./libs/StaticDB");
var init = function () {
    var app = (0, express_1.default)();
    app.set('trust proxy', 1);
    app.use((0, morgan_1.default)('dev'));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.use((0, cors_1.default)());
    app.engine('html', ejs_1.default.__express);
    app.set('view engine', 'html');
    app.set('views', config_1.default.viewsDir);
    app.set('views', path_1.default.join(config_1.default.viewsDir, 'excel-fuel'));
    app.use(express_1.default.static(path_1.default.join(config_1.default.viewsDir, './excel-fuel')));
    app.use('/app/', express_1.default.static(path_1.default.join(config_1.default.viewsDir, './excel-fuel')));
    (0, express_sess_1.default)(app);
    try {
        var auth = new auth_ctr_1.default(app, '/api');
        auth.AppUseAuth();
    }
    catch (err) {
        (0, umd_1.onerror)('[ServerAuth]', err);
        return;
    }
    var staticDB = new StaticDB_1.StaticDB();
    var apiRoutes;
    try {
        apiRoutes = (0, api_router_1.default)(staticDB);
        app.use('/api', apiRoutes);
    }
    catch (err) {
        (0, umd_1.onerror)('[apiRoutes]', err);
    }
    var excelApp;
    try {
        excelApp = (0, app_router_1.default)();
        app.use('/app', excelApp);
    }
    catch (err) {
        (0, umd_1.onerror)('[excelApp]', err);
    }
    app.get('/', function (req, res) {
        res.status(200).json({ response: true });
    });
    app.use('/welcome', function (req, res) {
        return res.status(200).json({ success: true, message: 'works fine', url: req.url, available_routes: (0, utils_1.listRoutes)(apiRoutes.stack, '/api'), status: 200 });
    });
    app.all('*', function (req, res) {
        res.status(400).json((0, tslib_1.__assign)((0, tslib_1.__assign)({}, messages_1.default['001']), { error: true }));
    });
    app.use(function (error, req, res, next) {
        (0, umd_1.onerror)(error);
        res.status(500).json((0, tslib_1.__assign)({ error: true }, messages_1.default['500']));
    });
    var server = app.listen(config_1.default.port, function () {
        (0, umd_1.attention)("server running on " + config_1.default.HOST);
        (0, umd_1.attention)('/api routes: ', (0, utils_1.listRoutes)(apiRoutes.stack, '/api'));
        (0, umd_1.attention)('/excelApp routes: ', (0, utils_1.listRoutes)(excelApp.stack, '/app'));
        (0, umd_1.attention)("environment: " + (0, utils_1.env)());
    });
    return { server: server, app: app };
};
init();
