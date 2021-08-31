"use strict";
module.exports = (config = null, db, mongo, jwt, DEBUG) => {
    const path = require('path');
    const { log } = require('x-utils-es/umd');
    const express = require('express');
    const userRouter = express.Router();
    const messages = require('../messages');
    const controllers = require('../controllers/user.controllers')(db, mongo, jwt, DEBUG);
    userRouter.use(function timeLog(req, res, next) {
        log('Time: ', Date.now());
        next();
    });
    userRouter.get('/api/list', controllers.list.bind(controllers));
    userRouter.post('/api/create', controllers.create.bind(controllers));
    userRouter.post('/api/:id/update', controllers.update.bind(controllers));
    userRouter.all('/api/*', function (req, res) {
        res.status(400).json({ ...messages['001'], error: true });
    });
    return userRouter;
};
