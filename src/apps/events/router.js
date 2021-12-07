const router = require('express').Router()

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const { handleRoutePermissions, setLocalNav } = require('../middleware')
const { getEventDetails } = require('./middleware/details')
const { renderReactifiedEventsView } = require('./controllers/events')
const attendeesRouter = require('./attendees/router')

router.get('/create', renderReactifiedEventsView)

router.use(handleRoutePermissions(APP_PERMISSIONS))
router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)

router.use('/:eventId/attendees', attendeesRouter)
router.param('eventId', getEventDetails)
router.get('/*', renderReactifiedEventsView)

module.exports = router
