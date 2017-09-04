const router = require('express').Router()

const { renderEventPage } = require('./controllers/edit')

router.get('/create', renderEventPage)

module.exports = router
