const router = require('express').Router()

const {
  renderActivityFeed,
  fetchActivityFeedHandler,
} = require('./controllers')

router.get('/', renderActivityFeed)
router.get('/data', fetchActivityFeedHandler)

module.exports = router
