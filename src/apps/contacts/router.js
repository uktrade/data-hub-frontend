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
const { getCommon } = require('./controllers/details')
const createAndEdit = require('./controllers/create-and-edit')
const { unarchiveContact } = require('./controllers/archive')

router.get(['/create', '/:contactId/edit'], createAndEdit)

router.get('/export', getRequestBody(QUERY_FIELDS), exportCollection('contact'))

router.use(
  '/:contactId',
  handleRoutePermissions(LOCAL_NAV),
  getCommon,
  setLocalNav(LOCAL_NAV)
)

router.get('/:contactId', redirectToFirstNavItem)

router.get('/:id/unarchive', unarchiveContact)

module.exports = router
