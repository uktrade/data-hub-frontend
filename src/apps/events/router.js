const router = require('express').Router()

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const { handleRoutePermissions, setLocalNav } = require('../middleware')
const { getEventDetails } = require('./middleware/details')
const { renderEventsView } = require('./controllers/events')
const { createAttendee } = require('./attendees/controllers/create')

router.get('/create', renderEventsView)
router.use(handleRoutePermissions(APP_PERMISSIONS))

router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)

// TODO: Get rid of this and fetch the event on the client
router.param('eventId', getEventDetails)
router.get('/:eventId/attendees/create/:contactId', createAttendee)
router.get('/:eventId*', renderEventsView)

module.exports = router
