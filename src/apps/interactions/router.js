const router = require('express').Router()

const urls = require('../../lib/urls')
const {
  fetchESSDetails,
} = require('../companies/apps/activity-feed/controllers')

const {
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
} = require('./constants')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')
const { getRequestBody } = require('../../middleware/collection')

const { handleRoutePermissions } = require('../middleware')

const subAppRouter = require('./router.sub-app')

router.use(handleRoutePermissions(APP_PERMISSIONS))

// Ess Location
router.get(
  urls.interactions.exportSupportService.detailsData.route,
  fetchESSDetails
)

router.get(
  '/export',
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  exportCollection('interaction')
)

router.use(subAppRouter)

module.exports = router
