const router = require('express').Router()

const { convertQueryTypes } = require('./translators')

const {
  renderActivityFeed,
  fetchActivityFeedHandler,
} = require('./controllers')

router.get('/', renderActivityFeed)
router.get('/data', convertQueryTypes, fetchActivityFeedHandler)

module.exports = router
