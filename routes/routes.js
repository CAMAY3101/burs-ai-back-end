const express = require('express')
const router = express.Router()

router.use('/usuarios', require('./usuario.router'))

module.exports = router;