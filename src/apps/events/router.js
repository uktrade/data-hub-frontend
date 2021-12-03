const router = require('express').Router()

const urls = require('../../lib/urls')

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const {
  handleRoutePermissions,
  setLocalNav,
  redirectToFirstNavItem,
} = require('../middleware')

const { renderReactifiedEventsView } = require('./controllers/events')

const attendeesRouter = require('./attendees/router')

router.use(handleRoutePermissions(APP_PERMISSIONS))
// TODO: Figure out why this alone doesn't do the job
router.get(urls.events.eventsWildcard(), renderReactifiedEventsView)
router.get('/:eventId/details', renderReactifiedEventsView)
router.get('/:eventId/edit', renderReactifiedEventsView)
router.get('/create', renderReactifiedEventsView)

router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)

router.get('/:eventId', redirectToFirstNavItem)
router.use('/:eventId/attendees', attendeesRouter)

module.exports = router
