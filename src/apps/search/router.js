const router = require('express').Router()

const { searchAction, renderSearchResults } = require('./controllers')

router.get('/companies', searchAction)
router.get('/:searchPath?', renderSearchResults)

module.exports = router
