// variables base de datos
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:m19m31a31@localhost:5432/dummy_test')

module.exports = {
    pgp, db
}