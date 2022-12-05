const Sequelize = require("sequelize");

//const dbPath = path.resolve(__dirname, "chat.sqlite");

const sequelize = new Sequelize("api-platform", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    //storage: dbPath,
    define: {
        timestamps: true,
        freezeTableName: true
    },
    dialectModule: require('mysql2'),
});

module.exports = sequelize;