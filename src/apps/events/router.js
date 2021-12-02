const router = require('express').Router()

const urls = require('../../lib/urls')

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const {
  handleRoutePermissions,
  setLocalNav,
  redirectToFirstNavItem,
} = require('../middleware')
// TODO: Remove RR-231
const { renderDetailsPage } = require('./controllers/details')
// TODO: Remove RR-231
const { renderFormPage } = require('./controllers/edit')
const { getEventDetails } = require('./middleware/details')

const { renderEventsView } = require('./controllers/events')

const attendeesRouter = require('./attendees/router')

router.use(handleRoutePermissions(APP_PERMISSIONS))
// TODO: Replace /event/* with just a react render for express and delete everything
// TODO: Remove RR-231
router.route('/create').get(renderFormPage)

router.param('eventId', getEventDetails)

router.get(urls.events.index(), renderEventsView)

router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)
// TODO: Remove RR-231
router.route('/:eventId/edit').get(renderFormPage)

router.get('/:eventId', redirectToFirstNavItem)
// TODO: Remove RR-231
router.get('/:eventId/details', renderDetailsPage)

router.use('/:eventId/attendees', attendeesRouter)

module.exports = router
