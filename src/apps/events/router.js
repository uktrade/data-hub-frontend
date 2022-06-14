const router = require('express').Router()

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const { handleRoutePermissions, setLocalNav } = require('../middleware')
const { getEventDetails } = require('./middleware/details')
const { renderEventsView } = require('./controllers/events')
const attendeesRouter = require('./attendees/router')
const userFeatures = require('../../middleware/user-features')
const {
  EVENT_ACTIVITY_FEATURE_FLAG,
} = require('../companies/apps/activity-feed/constants')
const urls = require('../../lib/urls')
const {
  fetchAventriEvent,
} = require('../companies/apps/activity-feed/controllers')

router.get('/create', renderEventsView)

router.use(handleRoutePermissions(APP_PERMISSIONS))
router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)

router.use('/:eventId/attendees', attendeesRouter)
router.param(
  'eventId',
  userFeatures(EVENT_ACTIVITY_FEATURE_FLAG),
  getEventDetails
)
// TODO: When everything in the events space is converted to react
// router.get('/*', renderEventsView)
router.get('/:eventId/edit', renderEventsView)
router.get('/:eventId', renderEventsView)
router.get('/:eventId/details', renderEventsView)
router.get('/aventri/:eventId/details', renderEventsView)

router.get(urls.events.aventri.data.route, fetchAventriEvent)

module.exports = router
