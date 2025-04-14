const mysql = require('mysql2/promise');
const config = require("./config.js");

let active = new Map();

const connectionPool = mysql.createPool({
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const queryDatabase = async (database, query, params) => {
    const connection = await connectionPool.getConnection();
    try {
        await connection.query("USE " + database);
        const [results, fields] = await connection.query(query, params);
        return results;
    } catch (error) {
        console.error("Database Error:", error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    queryAuth: (query, params) => queryDatabase(config.databaseAuth, query, params),
    queryWorld: (query, params) => queryDatabase(config.databaseWorld, query, params),
    queryCharacter: (query, params) => queryDatabase(config.databaseCharacter, query, params),
};
