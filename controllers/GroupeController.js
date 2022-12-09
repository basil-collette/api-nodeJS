const Sequelize = require("sequelize");
require('dotenv').config();

module.exports = class GroupeController {

    connexion;
    groupeModel;

    constructor() {
        this.connexion = require('../database/sequelize');

        /*
        this.connexion.authenticate().then(() => {
            console.log('Database Connection has been established successfully.');
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });
        */

        this.groupeModel = require("../models/groupe.model")(this.connexion, Sequelize.DataTypes);
    }

    // GET _________________________________________________________________________ GET

    async getAll() {
        return await this.groupeModel.findAll({
            attributes: ['name']
        });
    }

    async getAllNested() {
        const userModel = require("../models/user.model")(this.connexion, Sequelize.DataTypes);

        this.groupeModel.hasMany(userModel, {
            foreignKey: {
                type: Sequelize.DataTypes.UUID,
                allowNull: true,
                name: 'groupe_id'
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });

        const results = await this.groupeModel.findAll({
            attributes: ['name'],
            include: [{ model: userModel, attributes: ['username']}]
        });

        return results;
    }

    async getBydId(idGroupe) {
        return await this.groupeModel.findOne({ where: { id: idGroupe } });
    }

    async getByFilters(filters) {
        return await this.groupeModel.findOne({ where: filters });
    }

    // UPDATE ____________________________________________________________________ UPDATE

    async update(attributes, wheres) {

        return await this.groupeModel.update(
            attributes,
            {
                where: wheres
            }
        );
    }

    //DELETE __________________________________________________________________ DELETE

    async delete(wheres) {
        return await this.groupeModel.destroy(
            { where: wheres }
        );
    }

}