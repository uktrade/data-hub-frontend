const { renderSelect } = require('./controllers')

const router = require('express').Router()

router.use('/select', renderSelect)

module.exports = router
