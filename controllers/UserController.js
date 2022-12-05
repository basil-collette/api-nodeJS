const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');

module.exports = class UserController {

    connexion;
    userModel;

    constructor() {
        this.connexion = require('../database/sequelize');

        this.connexion.authenticate().then(() => {
            console.log('Database Connection has been established successfully.');
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });

        this.userModel = require("../models/user.model")(this.connexion, Sequelize.DataTypes);
    }

    async register(userFields) {
        let user = await this.userModel.create({
            "username": userFields.username,
            "email": userFields.email,
            "firstName": userFields.firstName,
            "lastName": userFields.lastName,
            "password": userFields.password,
            "createdAt": userFields.createdAt,
            "updatedAt": userFields.updatedAt,
            "groupeId": userFields.groupeId
        });

        return user;
    }

    async login(login, password) {
        
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );

        return token;
	}

    async getAll() {
        return await this.userModel.findAll();
    }

    async getBydId(idUser) {
        return await this.userModel.findOne({ where: { id: idUser } });
    }

    async getByFilters(filters) {
        return await this.userModel.findOne({ where: filters });
    }

}