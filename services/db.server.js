const pgp = require('pg-promise')();

const { DB_USERNAME2, DB_PASSWORD2, DB_HOST2, DB_PORT2, DB_NAME2 } = process.env;

let db;

const cn = {
    host: DB_HOST2,
    port: DB_PORT2,
    database: DB_NAME2,
    user: DB_USERNAME2,
    password: DB_PASSWORD2,
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