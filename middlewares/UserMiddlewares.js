const UserController = new(require('../controllers/UserController'));

const login = async (req, res, next) => {
    try {
        const userFields = req.body;
        let token = await UserController.login(userFields.username, userFields.password);

        res.header('Authorization', 'Bearer ' + token);
        res.status(200);
        res.send(token);
        next();
        
    } catch (err) {
        res.status(404);
        res.end('user_not_authentified');
        //next(err);
    }
}

const isAuthorized = async (req, res, next) => {
    const authentifiedUser = await UserController.getAuthorizedUser(req);

    if (!authentifiedUser) {
        res.status(400).send("not_authentified");
        throw new Error();
    }
    
    if(authentifiedUser.id != res.locals.userId && !authorizedUser.roles.includes('ROLE_ADMIN')) {
        res.status(400).send("not_authorized");
        throw new Error();
    }

    res.locals.authentifiedUser = authentifiedUser;
    next();
}

const loginInputsAreSent = (req, res, next) => {
    const userFields = req.body;

    if (!userFields.username && !userFields.password) {
        res.status(400).send("list of needed inputs is required");
        throw new Error();
    }
        
    for (let i in res.locals.inputsNedded) {
        if (!req.body.includes(i)) {
            res.status(400).send("All inputs are required");
            throw new Error();
        }
    }
    next();
}

const registerInputsAreSent = (req, res, next) => {
    const userFields = req.body;
    if (userFields.email && userFields.firstName && userFields.lastName) {
        
        for (let i in res.locals.inputsNedded) {
            if (!req.body.includes(i)) {
                res.status(400).send("All inputs are required");
                throw new Error();
            }
        }
        next();
        
    } else {
        res.status(400).send("list of needed inputs is required");
        throw new Error();
    }
}

const userDoesntExists = async (req, res, next) => {
    const userFields = req.body;
    if (await UserController.exists(userFields.username)) {
        return res.status(409).send("Error during registration. Please contact support");
    }
    next();
}

const prePersist = (req, res, next) => {
    const date = new Date();
    req.body.createdAt = date;
    req.body.updatedAt = date;
    if(!req.body.roles) {
        req.body.roles = ["ROLE_USER"];
    }
    next();
}

const register = async (req, res, next) => {
    const user = await UserController.register(req.body);
        
    if (user) {
        console.log("register : OK");
        res.status(201);
        res.send(user);
        next();
    } else {
        res.status(404);
        res.end();
    }
}

const getAll = async (req, res, next) => {
    try {
        let users = await UserController.getAll();

        res.status(200);
        res.send(users);
        next();
    } catch (err) {
        next(err);
    }
}

const getAllNested = async (req, res, next) => {
    try {
        let users = await UserController.getAllNested();

        res.status(200);
        res.send(users);
        next();
    } catch (err) {
        next(err);
    }
}

const setProcessingUser = (req, res, next) => {
    try {
        res.locals.userId = parseInt(req.params.idUser);
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = {
    loginInputsAreSent,
    userDoesntExists,
    prePersist,
    register,
    registerInputsAreSent,
    isAuthorized,
    login,
    getAll,
    getAllNested,
    setProcessingUser
};