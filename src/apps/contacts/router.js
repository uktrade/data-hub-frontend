const router = require('express').Router()

const { setLocalNav, setDefaultQuery, redirectToFirstNavItem } = require('../middleware')
const { getContactsCollection, getRequestBody } = require('./middleware/collection')
const { getCommon, getDetails } = require('./controllers/details')
const { renderContactList } = require('./controllers/list')
const { postDetails, editDetails } = require('./controllers/edit')
const { archiveContact, unarchiveContact } = require('./controllers/archive')
const { renderDocuments } = require('./controllers/documents')
const { renderInteractions } = require('./controllers/interactions')
const { getAudit } = require('./controllers/audit')

const { setInteractionsReturnUrl, setInteractionsEntityName, setCompanyDetails } = require('./middleware/interactions')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('../interactions/middleware/collection')

const interactionsRouter = require('../interactions/router.sub-app')

const LOCAL_NAV = [
  { path: 'details', label: 'Details' },
  { path: 'interactions', label: 'Interactions' },
  { path: 'audit', label: 'Audit history' },
  { path: 'documents', label: 'Documents' },
]

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
  archived: false,
}

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getContactsCollection, renderContactList)

router
  .route('/create')
  .get(editDetails)
  .post(postDetails)

router.use('/:contactId', getCommon, setLocalNav(LOCAL_NAV))

router.get('/:contactId', redirectToFirstNavItem)
router.get('/:contactId/details', getDetails)

router
  .route('/:contactId/edit')
  .get(editDetails)
  .post(postDetails)

router.post('/:id/archive', archiveContact)
router.get('/:id/unarchive', unarchiveContact)

router.get('/:contactId/interactions',
  setInteractionsReturnUrl,
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractions
)

router.get('/:contactId/audit', getAudit)

router.get('/:contactId/documents', renderDocuments)

router.use('/:contactId', setInteractionsReturnUrl, setInteractionsEntityName, setCompanyDetails, interactionsRouter)

module.exports = router
