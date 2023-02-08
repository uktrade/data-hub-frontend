const router = require('express').Router()
const urls = require('../../lib/urls')

const { LOCAL_NAV, QUERY_FIELDS } = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

const {
  setLocalNav,
  redirectToFirstNavItem,
  handleRoutePermissions,
} = require('../middleware')
const { getCommon, getDetails } = require('./controllers/details')
const { renderContactsView } = require('./controllers/contacts')
const createAndEdit = require('./controllers/create-and-edit')
const { unarchiveContact } = require('./controllers/archive')
const { renderDocuments } = require('./controllers/documents')
const { getAudit } = require('./controllers/audit')
const { renderContactActivityForEntity } = require('./controllers/activity')

const { setInteractionsDetails } = require('./middleware/interactions')

const {
  fetchActivitiesForContact,
} = require('../companies/apps/activity-feed/controllers')

router.get(urls.contacts.index(), renderContactsView)
router.get(['/create', '/:contactId/edit'], createAndEdit)

router.get('/export', getRequestBody(QUERY_FIELDS), exportCollection('contact'))

router.use(
  '/:contactId',
  handleRoutePermissions(LOCAL_NAV),
  getCommon,
  setLocalNav(LOCAL_NAV)
)

router.get('/:contactId', redirectToFirstNavItem)
router.get('/:contactId/details', getDetails)

router.get('/:id/unarchive', unarchiveContact)

router.get('/:contactId/audit', getAudit)

router.get('/:contactId/documents', renderDocuments)

router.use(
  '/:contactId/interactions',
  setInteractionsDetails,
  renderContactActivityForEntity
)

router.get(urls.contacts.activity.data.route, fetchActivitiesForContact)

module.exports = router
