const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { convertQueryTypes } = require('./translators')
const { fetchActivityFeedHandler } = require('./controllers')

router.get(
  urls.companies.activity.data.route,
  convertQueryTypes,
  fetchActivityFeedHandler
)

module.exports = router
