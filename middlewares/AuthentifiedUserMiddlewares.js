const express = require('express');
const router = express.Router();
const UserController = new(require('../controllers/UserController'));

router.post('/getbyid', async (req, res, next) => {
    try {
        let user = await UserController.getBydId(res.locals.userId);

        res.status(200);
        res.send(JSON.stringify(user));
        next();
    } catch (err) {
        next(err);
    }
});

router.post('/getbyusername/:username', async (req, res, next) => {
    try {
        let user = await UserController.getByFilters({username: req.params.username});

        res.status(200);
        res.send(JSON.stringify(user));
        next();
        
    } catch (err) {
        next(err);
    }
});

router.post('/setgroupe/:idGroupe', async (req, res, next) => {
    try {
        let user = await UserController.update(
            { groupeId: parseInt(req.params.idGroupe) },
            { id: res.locals.userId }
        );

        res.status(200);
        res.send(user);
        next();
        
    } catch (err) {
        next(err);
    }
});

router.post('/update', async (req, res, next) => {
    try {
        let user = await UserController.update(
            req.body,
            { id: res.locals.userId }
        );

        res.status(200);
        res.send(user);
        next();

    } catch(err) {
        next(err);
    }
});

router.post('/delete', async (req, res, next) => {
    try {
        await UserController.delete({ id: parseInt(res.locals.userId) });

        res.status(200);
        res.send('user_deleted');
        next();

    } catch(err) {
        next(err);
    }
});

module.exports = router;