const router = require('express').Router()

const { renderProjects } = require('./controllers')

router.get('/', renderProjects)

module.exports = router
