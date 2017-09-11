const router = require('express').Router()

const { setLocalNav, setDefaultQuery, redirectToFirstNavItem } = require('../middleware')
const { getContactsCollection, getRequestBody } = require('./middleware/collection')
const { getInteractionCollection } = require('./middleware/interactions')
const { getCommon, getDetails } = require('./controllers/details')
const { renderContactList } = require('./controllers/list')
const { postDetails, editDetails } = require('./controllers/edit')
const { archiveContact, unarchiveContact } = require('./controllers/archive')
const { renderInteractions } = require('./controllers/interactions')
const { getAudit } = require('./controllers/audit')

const LOCAL_NAV = [
  { path: 'details', label: 'Details' },
  { path: 'interactions', label: 'Interactions' },
  { path: 'audit', label: 'Audit history' },
]

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
}

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getContactsCollection, renderContactList)

router
  .route('/create')
  .get(editDetails)
  .post(postDetails)

router.use('/:contactId', setLocalNav(LOCAL_NAV))
router.get('/:contactId', redirectToFirstNavItem)
router.get('/:contactId/details', getCommon, getDetails)

router
  .route('/:contactId/edit')
  .get(getCommon, editDetails)
  .post(getCommon, postDetails)

router.post('/:id/archive', archiveContact)
router.get('/:id/unarchive', unarchiveContact)

router.get('/:contactId/interactions', getCommon, getInteractionCollection, renderInteractions)
router.get('/:contactId/audit', getCommon, getAudit)

module.exports = router
