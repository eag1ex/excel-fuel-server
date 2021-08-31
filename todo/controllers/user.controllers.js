"use strict";
const CONFIG = require('../../config');
const { cleanOut, validID, validStatus } = require('../utils');
class ServerController {
    constructor(opts, debug) {
        this.debug = debug;
    }
    async list(req, res) {
        let limit = 50;
        return res.status(200).json({
            response: true,
            code: 200
        });
    }
    async create(req, res) {
        const body = req.body || {};
        if (!body.title) {
            return res.status(400).json({ error: 'missing title' });
        }
        const userData = {
            user: { name: CONFIG.mongo.defaultUser },
            title: body.title
        };
        return res.status(200).json({
            response: userData,
            code: 200
        });
    }
    async update(req, res) {
        const id = req.params.id;
        const body = req.body || {};
        if (!validID(id))
            return res.status(400).json({ error: 'Not a valid {id}' });
        return res.status(200).json({
            response: { id, ...body },
            code: 200
        });
    }
}
module.exports = (dbc, mongo, jwt, debug) => {
    return new ServerController({}, debug);
};
