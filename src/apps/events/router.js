const router = require('express').Router()

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const { handleRoutePermissions, setLocalNav } = require('../middleware')
const { getEventDetails } = require('./middleware/details')
const { renderEventsView } = require('./controllers/events')

router.get('/create', renderEventsView)
router.use(handleRoutePermissions(APP_PERMISSIONS))

router.get('/aventri/:aventriEventId/details', renderEventsView)
router.get('/aventri/:aventriEventId/registration/:status', renderEventsView)

router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)

// TODO: Get rid of this and fetch the event on the client
router.param('eventId', getEventDetails)
router.get('/:eventId*', renderEventsView)

module.exports = router
