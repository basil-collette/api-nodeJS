const express = require('express');
const router = express.Router();
const UserMiddlewares = require('../middlewares/UserMiddlewares');

//Routes that need authorization (Authentified and concerned or Admin)
router.use('/setProcessUser/:idUser', UserMiddlewares.setProcessingUser, UserMiddlewares.isAuthorized, require('../middlewares/AuthentifiedUserMiddlewares'));

router.post("/register", UserMiddlewares.loginInputsAreSent, UserMiddlewares.userDoesntExists, UserMiddlewares.prePersist, UserMiddlewares.register);

router.post("/login", UserMiddlewares.loginInputsAreSent, UserMiddlewares.login);

router.get('/getAll', UserMiddlewares.getAll);

router.get('/getAllNested', UserMiddlewares.getAllNested);

module.exports = router;