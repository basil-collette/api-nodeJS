const express = require('express');
const router = express.Router();
const UserController = new(require('../controllers/UserController'));

router.post("/register", async function (req, res, next) {
    try {
        const userFields = req.body;

        if (!(userFields.username && userFields.email && userFields.password && userFields.firstName && userFields.lastName)) {
            res.status(400).send("All inputs are required");
        }

        if (await UserController.exists(userFields.username)) {
            return res.status(409).send("Error during registration. Please contact support");
        }

        const date = new Date();
        userFields.createdAt = date;
        userFields.updatedAt = date;
        if(!userFields.roles) {
            userFields.roles = ["ROLE_USER"];
        }

        let user = await UserController.register(userFields);
        
        if (user) {
            res.status(201);
            res.send(user);
        } else {
            res.status(404);
            res.end();
        }

    } catch (err) {
        next(err);
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const userFields = req.body;

        if (!(userFields.username && userFields.password)) {
            res.status(400).send("All inputs are required");
        }

        let token = await UserController.login(userFields.username, userFields.password);
        
        if (token) {
            res.header('Authorization', 'Bearer ' + token);
            res.status(200); //.json('auth_ok');
            res.send(token);
        } else {
            res.status(404);
            res.end('user_not_found');
        }
    } catch (err) {
        next(err);
    }
});

router.get('/getAll', async function (req, res, next) {
    try {
        let users = await UserController.getAll();

        res.status(200);
        res.send(users);
        //next();
    } catch (err) {
        next(err);
    }
});

router.get('/getAllNested', async function (req, res, next) {
    try {
        let users = await UserController.getAllNested();

        res.status(200);
        res.send(users);
        //next();
    } catch (err) {
        next(err);
    }
});

router.get('/getbyid/:id', async (req, res, next) => {
    try {
        const authorizedUser = await UserController.getAuthorizedUser(req);
        
        if (authorizedUser.id == parseInt(req.params.id) || authorizedUser.roles.includes('ROLE_ADMIN')) {
            const id = req.params.id;
            let user = await UserController.getBydId(id);

            res.status(200);
            res.send(JSON.stringify(user));
        } else {
            throw new Error('not_authorized');
        }
        
    } catch (err) {
        next(err);
    }
});

router.get('/getbyusername/:username', async (req, res, next) => {
    try {
        const authorizedUser = await UserController.getAuthorizedUser(req);
        
        if (authorizedUser.username == req.params.username || authorizedUser.roles.includes('ROLE_ADMIN')) {
            const username = req.params.username;
            let user = await UserController.getByFilters({username: username});

            res.status(200);
            res.send(JSON.stringify(user));
        } else {
            throw new Error('not_authorized');
        }
        
    } catch (err) {
        next(err);
    }
});

router.get('/:id/setgroupe/:id', async (req, res, next) => {
    try {
        const authorizedUser = await UserController.getAuthorizedUser(req);
        
        if (authorizedUser.id == parseInt(req.params.id) || authorizedUser.roles.includes('ROLE_ADMIN')) {
            let user = await UserController.update(
                { groupeId: parseInt(req.params.id) },
                { id: authorizedUser.id }
            );

            res.status(200);
            res.send(user);
        } else {
            throw new Error('not_authorized');
        }
        
    } catch (err) {
        next(err);
    }
});

router.post('/update/:id', async (req, res, next) => {
    try {
        const authorizedUser = await UserController.getAuthorizedUser(req);
        
        if (authorizedUser.id == parseInt(req.params.id) || authorizedUser.roles.includes('ROLE_ADMIN')) {
            let user = await UserController.update(
                req.body,
                { id: authorizedUser.id }
            );

            res.status(200);
            res.send(user);
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
            await UserController.delete({ id: parseInt(req.params.id) });

            res.status(200);
            res.send('user_deleted');
        } else {
            throw new Error('not_authorized');
        }
    } catch(err) {
        next(err);
    }
});

module.exports = router;