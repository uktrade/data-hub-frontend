const router = require('express').Router()

const { renderEditOneList } = require('./controllers')

router.get('/', renderEditOneList)

module.exports = router
