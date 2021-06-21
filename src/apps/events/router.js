const router = require('express').Router()

const urls = require('../../lib/urls')

const { ENTITIES } = require('../search/constants')
const {
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  LOCAL_NAV,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
} = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const { getCollection } = require('../../modules/search/middleware/collection')

const {
  setDefaultQuery,
  handleRoutePermissions,
  setLocalNav,
  redirectToFirstNavItem,
} = require('../middleware')
const { renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')
const { postDetails, getEventDetails } = require('./middleware/details')

const { renderEventList } = require('./controllers/list')
// New react view (in progress) - to replace 'renderEventList' when finished
const { renderEventsView } = require('./controllers/events')

const attendeesRouter = require('./attendees/router')

const { transformEventToListItem } = require('./transformers')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.route('/create').post(postDetails, renderEditPage).get(renderEditPage)

router.param('eventId', getEventDetails)

router.get(
  '/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  getCollection('event', ENTITIES, transformEventToListItem),
  renderEventList
)

// New react route (to replace the old events list route above when complete)
router.get(urls.events.react.index.route, renderEventsView)

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
