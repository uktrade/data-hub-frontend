const router = require('express').Router()
const { getActivityFeedHandler } = require('./controllers')

router.get('/api/activity-feed', getActivityFeedHandler)

module.exports = router
