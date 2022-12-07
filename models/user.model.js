const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user", {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.NUMBER,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        roles: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: ["ROLE_USER"],
            allowNull: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'updated_at'
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'first_name'
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'last_name'
        },
        groupeId: {
            type: Sequelize.NUMBER,
            allowNull: true,
            field: 'groupe_id'
        }
    }, {
        tableName: 'user'
    });

    /*
    userModel.associate = function (models) {
        // define your relations 
    }
    */
};