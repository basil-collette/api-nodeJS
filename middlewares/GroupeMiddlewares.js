const GroupeController = new(require('../controllers/GroupeController'));

const getAll = async (req, res, next) => {
    try {
        let groupes = await GroupeController.getAll();

        res.status(200);
        res.send(groupes);
        next();
    } catch (err) {
        next(err);
    }
};

const getAllNested = async (req, res, next) => {
    try {
        let groupes = await GroupeController.getAllNested();

        res.status(200);
        res.send(groupes);
        next();
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const id = req.params.idGroupe;
        let groupe = await GroupeController.getBydId(id);

        res.status(200);
        res.send(JSON.stringify(groupe));
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAll,
    getAllNested,
    getById,
};