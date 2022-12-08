const express = require('express');
const router = express.Router();
const GroupeController = new(require('../controllers/GroupeController'));
const UserController = new(require('../controllers/UserController'));
const {Op} = require("sequelize");

router.get('/getAll', async function (req, res, next) {
    try {
        let groupes = await GroupeController.getAll();

        res.status(200);
        res.send(groupes);
    } catch (err) {
        next(err);
    }
});

router.get('/getAllNested', async function (req, res, next) {
    try {
        let groupes = await GroupeController.getAllNested();

        res.status(200);
        res.send(groupes);
    } catch (err) {
        next(err);
    }
});

router.get('/get/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        let groupe = await GroupeController.getBydId(id);

        res.status(200);
        res.send(JSON.stringify(groupe));
    } catch (err) {
        next(err);
    }
});

router.post('/update/:id', async (req, res, next) => {
    try {
        const authorizedUser = await UserController.getAuthorizedUser(req);
        
        if (authorizedUser.roles.includes('ROLE_ADMIN')) {
            let groupe = await GroupeController.update(
                req.body,
                { id: parseInt(req.params.id) }
            );

            res.status(200);
            res.send(groupe);
        } else {
            throw new Error('not_authorized');
        }
    } catch(err) {
        next(err);
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        const authorizedUser = await UserController.getAuthorizedUser(req);
        
        if (authorizedUser.roles.includes('ROLE_ADMIN')) {
            let groupe = await GroupeController.delete({ id: parseInt(req.params.id) });

            res.status(200);
            res.send('group_deleted');
        } else {
            throw new Error('not_authorized');
        }
    } catch(err) {
        next(err);
    }
});

router.post('/setusers/:id', async (req, res, next) => {
    try {
        const authorizedUser = await UserController.getAuthorizedUser(req);

        if (authorizedUser.roles.includes('ROLE_ADMIN')) {

            if (req.body.users) {
                await UserController.updateGroupUsers(parseInt(req.params.id), req.body.users);
                /*
                await UserController.update(
                    { groupeId: parseInt(req.params.id) },
                    { id: { [Op.in]: req.body.users } }
                );
                */
                res.status(200);
                res.send('users_added_to_group');
            } else {

            }
        } else {
            throw new Error('not_authorized');
        }
    } catch(err) {
        next(err);
    }
});

module.exports = router;