const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { convertQueryTypes } = require('./translators')
const {
  renderActivityFeed,
  fetchActivityFeedHandler,
} = require('./controllers')
const { ACTIVITY_STREAM_FEATURE_FLAG } = require('./constants')
const userFeatures = require('../../../../middleware/user-features')

router.get(urls.companies.activity.index.route, renderActivityFeed)
router.get(
  urls.companies.activity.data.route,
  convertQueryTypes,
  userFeatures(ACTIVITY_STREAM_FEATURE_FLAG),
  fetchActivityFeedHandler
)

module.exports = router
