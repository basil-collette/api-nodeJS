const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = class UserController {

    connexion;
    userModel;

    constructor() {
        this.connexion = require('../database/sequelize');

        /*
        this.connexion.authenticate().then(() => {
            console.log('Database Connection has been established successfully.');
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });
        */
       
        this.userModel = require("../models/user.model")(this.connexion);
    }

    //Account ________________________________________________________________________ Account

    async register(userFields) {
        let hashedPassword = await bcrypt.hash(userFields.password, 10);

        let user = await this.userModel.create({
            "username": userFields.username,
            "email": userFields.email,
            "firstName": userFields.firstName,
            "lastName": userFields.lastName,
            "password": hashedPassword,
            "createdAt": userFields.createdAt,
            "updatedAt": userFields.updatedAt,
            "groupeId": userFields.groupeId,
            "roles": userFields.roles,
        });

        return user;
    }

    async login(login, password) {
        let user = await this.getByFilters({
            username: login
        });
        
        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const expireIn = 24 * 60 * 60; //hour * minutes * seconds
                const token = jwt.sign({
                    username: user.username,
                    password: user.password,
                    /*
                    id: user.id,
                    roles: user.roles,
                    */
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: expireIn
                });

                return token;
            } else {
                throw new Error('user_not_found');
            }
            
        } else {
            throw new Error('user_not_found');
        }
	}

    async getAuthorizedUser(req) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.TOKEN_KEY);

            const userCredentials = jwt.decode(token, process.env.TOKEN_KEY);

            //return (({ username, password }) => ({ username, password }))(userCredentials);
            return await this.getByFilters({ username: userCredentials.username });
            
        } catch (err) {
            return false;
        }
    }

    //GET ________________________________________________________________________ GET

    async getAll() {
        return await this.userModel.findAll({
            attributes: ['firstName', 'lastName']
        });
    }

    async getAllNested() {
        const groupeModel = require("../models/groupe.model")(this.connexion);

        this.userModel.belongsTo(groupeModel, {
            foreignKey: {
                type: Sequelize.DataTypes.UUID,
                allowNull: true,
                name: 'groupe_id'
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });

        const results = await this.userModel.findAll({
            attributes: ['username'],
            include: [{ model: groupeModel, attributes: ['name']}]
        });

        return results;
    }

    async getBydId(idUser) {
        return await this.userModel.findOne({ where: { id: idUser } });
    }

    async getByFilters(filters) {
        return await this.userModel.findOne({ where: filters });
    }

    //UPDATE __________________________________________________________________ UPDATE

    async update(attributes, wheres) {
        if (attributes.password) {
            attributes.password = await bcrypt.hash(attributes.password, 10);
        }

        return await this.userModel.update(
            attributes,
            {
                where: wheres
            }
        );
    }

    async updateGroupUsers(groupId, userList) {
        let query =
            `UPDATE user SET 
                groupe_id = case 
                When groupe_id = ${ groupId } AND id NOT IN (${ userList }) then null
                else 1
            end`;
        return await this.groupeModel.query(query, { type: QueryTypes.UPDATE });
    }

    //DELETE __________________________________________________________________ DELETE

    async delete(wheres) {
        return await this.userModel.destroy(
            { where: wheres }
        );
    }

    //OTHER ___________________________________________________________________ OTHER

    async exists(username) {
        const user = await this.getByFilters({username: username});
        return user != null;
    }
}