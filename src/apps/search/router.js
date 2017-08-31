const router = require('express').Router()

const { renderSearchResults } = require('./controllers')

router.get('/:searchPath?', renderSearchResults)

module.exports = router
