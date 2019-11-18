const router = require('express').Router()
const { renderAdvisers } = require('./controllers/advisers')

router.get('/', renderAdvisers)

module.exports = router
