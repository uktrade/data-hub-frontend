const router = require('express').Router()

const urls = require('../../lib/urls')

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const {
  handleRoutePermissions,
  setLocalNav,
  redirectToFirstNavItem,
} = require('../middleware')
const { renderDetailsPage } = require('./controllers/details')
const { renderFormPage } = require('./controllers/edit')
const { getEventDetails } = require('./middleware/details')

const { renderEventsView } = require('./controllers/events')

const attendeesRouter = require('./attendees/router')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.route('/create').get(renderFormPage)

router.param('eventId', getEventDetails)

router.get(urls.events.index(), renderEventsView)

router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)

router.route('/:eventId/edit').get(renderFormPage)

router.get('/:eventId', redirectToFirstNavItem)
router.get('/:eventId/details', renderDetailsPage)

router.use('/:eventId/attendees', attendeesRouter)

module.exports = router
