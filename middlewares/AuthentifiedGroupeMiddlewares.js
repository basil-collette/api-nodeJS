const express = require('express');
const router = express.Router();
const UserController = new(require('../controllers/UserController'));
const GroupeController = new(require('../controllers/GroupeController'));

router.post('/update/:idGroupe', async (req, res, next) => {
    try {
        let groupe = await GroupeController.update(
            req.body,
            { id: parseInt(req.params.idGroupe) }
        );

        res.status(200);
        res.send(groupe);
        next();
    } catch (err) {
        next(err);
    }
});

router.post('/delete/:idGroupe', async (req, res, next) => {
    try {
        await GroupeController.delete({ id: parseInt(req.params.idGroupe) });

        res.status(200);
        res.send('group_deleted');
        next();
    } catch (err) {
        next(err);
    }
});

router.post('/setusers/:idGroupe', async (req, res, next) => {
    if (req.body.users) {
        throw new Error("users_must_be_specified");
    }
    
    try {          
        await UserController.updateGroupUsers(parseInt(req.params.idGroupe), req.body.users);

        res.status(200);
        res.send('users_added_to_group');
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = router;