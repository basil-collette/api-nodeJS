const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const UserController = new(require('../controllers/UserController'));

router.post("/register", async function (req, res, next) {
    try {
        const userFields = req.body;

        if (!(userFields.username && userFields.email && userFields.password && userFields.firstName && userFields.lastName)) {
            res.status(400).send("All input are required");
        }

        /*
        if (await User.findOne({ email })) {
            return res.status(409).send("User Already Exist. Please Login");
        }
        */

        const date = new Date();
        userFields.createdAt = date;
        userFields.updatedAt = date;
        userFields.password = await bcrypt.hash(userFields.password, 10);
        if(!userFields.roles) {
            userFields.roles = [];
        }

        let user = await UserController.register(userFields);

        res.status(201);
        res.send(user);

    } catch (err) {
        next(err);
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const userFields = req.body;

        if (!(userFields.username && userFields.password)) {
            res.status(400).send("All input are required");
        }

        let token = await UserController.login(userFields.username, userFields.password);

        res.status(201);
        res.send(token);
        
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

router.get('/get/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        let user = await UserController.getBydId(id);

        res.status(200);
        res.send(JSON.stringify(user));
        //next();
    } catch (err) {
        next(err);
    }
});

module.exports = router;