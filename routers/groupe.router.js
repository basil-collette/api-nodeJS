const express = require('express');
const router = express.Router();
const GroupeMiddlewares = require('../middlewares/GroupeMiddlewares');
const UserMiddlewares = require('../middlewares/UserMiddlewares');

router.get('/getAll', GroupeMiddlewares.getAll);

router.get('/getAllNested', GroupeMiddlewares.getAllNested);

router.get('/get/:idGroupe', GroupeMiddlewares.getById);

router.post('/admin', UserMiddlewares.isAuthorized, require('../middlewares/AuthentifiedGroupeMiddlewares'));

module.exports = router;