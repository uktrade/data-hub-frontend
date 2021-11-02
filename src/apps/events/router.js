const router = require('express').Router()

const urls = require('../../lib/urls')

const { APP_PERMISSIONS, LOCAL_NAV } = require('./constants')

const {
  handleRoutePermissions,
  setLocalNav,
  redirectToFirstNavItem,
} = require('../middleware')
const { renderDetailsPage } = require('./controllers/details')
const { renderEditPage, renderFormPage } = require('./controllers/edit')
const { postDetails, getEventDetails } = require('./middleware/details')

const { renderEventsView } = require('./controllers/events')

const attendeesRouter = require('./attendees/router')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.route('/create').post(postDetails, renderEditPage).get(renderEditPage)
// TODO: Temp route to placehold react implementation
router.route('/create-2').get(renderFormPage)

router.param('eventId', getEventDetails)

router.get(urls.events.index(), renderEventsView)

router.use(
  '/:eventId',
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)

router
  .route('/:eventId/edit')
  .post(postDetails, renderEditPage)
  .get(renderEditPage)

router.get('/:eventId', redirectToFirstNavItem)
router.get('/:eventId/details', renderDetailsPage)

router.use('/:eventId/attendees', attendeesRouter)

module.exports = router
