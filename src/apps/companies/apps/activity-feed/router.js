const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { convertQueryTypes } = require('./translators')
const {
  renderActivityFeed,
  fetchActivityFeedHandler,
} = require('./controllers')

router.get(urls.companies.activity.index.route, renderActivityFeed)
router.get(
  urls.companies.activity.data.route,
  convertQueryTypes,
  fetchActivityFeedHandler
)

module.exports = router
