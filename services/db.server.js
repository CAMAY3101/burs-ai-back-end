// variables base de datos
const { DB_URL, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
//const pgp = require('pg-promise')()

//const db = pgp('postgres://postgres:m19m31a31@localhost:5432/dummy_test')

const pgp = require('pg-promise')();

let db;
const cn = {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false // Acepta certificados autofirmados (opcional, úsalo solo si es necesario)
    }
};

try {
    db = pgp(cn);
    //db = pgp(cn);
    //db = pgp('postgres://postgres:m19m31a31@localhost:5432/dummy_test')
    console.log("Conexión a la base de datos establecida con éxito.");
} catch (e) {
    console.error("Error al conectar a la base de datos:", e);
}

module.exports = {
    pgp, db
};