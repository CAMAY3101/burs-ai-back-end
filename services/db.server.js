const pgp = require('pg-promise')();

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

let db;

const cn = {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
};

try {
    db = pgp(cn);
    console.log("Conexión a la base de datos establecida con éxito.");
} catch (e) {
    console.error("Error al conectar a la base de datos:", e);
}

module.exports = {
    pgp, db
};