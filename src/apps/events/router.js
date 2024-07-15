const router = require('express').Router()

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const { handleRoutePermissions, setLocalNav } = require('../middleware')
const { getEventDetails } = require('./middleware/details')
const { renderEventsView } = require('./controllers/events')
const attendeesRouter = require('./attendees/router')

router.get('/create', renderEventsView)
router.use(handleRoutePermissions(APP_PERMISSIONS))

router.get('/aventri/:aventriEventId/details', renderEventsView)
router.get('/aventri/:aventriEventId/registration/:status', renderEventsView)

router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)

router.use('/:eventId/attendees', attendeesRouter)
router.param('eventId', getEventDetails)
// TODO: When everything in the events space is converted to react
// router.get('/*', renderEventsView)
router.get('/:eventId/edit', renderEventsView)
router.get('/:eventId', renderEventsView)
router.get('/:eventId/details', renderEventsView)

module.exports = router
