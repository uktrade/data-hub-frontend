const router = require('express').Router()

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
const createAndEdit = require('./controllers/create-and-edit')
const { unarchiveContact } = require('./controllers/archive')
const { getAudit } = require('./controllers/audit')
const { renderContactActivityForEntity } = require('./controllers/activity')

const { setInteractionsDetails } = require('./middleware/interactions')

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

router.use(
  '/:contactId/interactions',
  setInteractionsDetails,
  renderContactActivityForEntity
)

module.exports = router
