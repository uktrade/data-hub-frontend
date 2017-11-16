const router = require('express').Router()

const {
  renderAddStepOne,
  postAddStepOne,
  renderAddStepTwo,
} = require('./controllers/add')

const { renderCompanyList } = require('./controllers/list')
const { renderForm } = require('./controllers/edit')
const { renderDetails } = require('./controllers/view')
const { renderInvestments } = require('./controllers/investments')
const { renderOrders } = require('./controllers/orders')
const { renderAuditLog } = require('./controllers/audit')
const { renderInteractions } = require('./controllers/interactions')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./controllers/exports')

const { setDefaultQuery, setLocalNav, redirectToFirstNavItem } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('../interactions/middleware/collection')

const { getRequestBody, getCompanyCollection, getLimitedCompaniesCollection } = require('./middleware/collection')
const { populateForm, handleFormPost, setIsEditMode } = require('./middleware/form')
const { getCompany, getCompaniesHouseRecord } = require('./middleware/params')
const { setInteractionsReturnUrl, setInteractionsEntityName } = require('./middleware/interactions')

const interactionsRouter = require('../interactions/router.sub-app')

const LOCAL_NAV = [
  { path: 'details', label: 'Details' },
  { path: 'contacts', label: 'Contacts' },
  { path: 'interactions', label: 'Interactions' },
  { path: 'exports', label: 'Export' },
  { path: 'investments', label: 'Investment' },
  { path: 'orders', label: 'Orders (OMIS)' },
  { path: 'audit', label: 'Audit history' },
]
const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
}

router.param('companyId', getCompany)
router.param('companyNumber', getCompaniesHouseRecord)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getCompanyCollection, renderCompanyList)

router
  .route('/add-step-1')
  .get(renderAddStepOne)
  .post(postAddStepOne, renderAddStepOne)

router.get('/add-step-2', getLimitedCompaniesCollection, renderAddStepTwo)

router
  .route('/:companyId/exports/edit')
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

router
  .route([
    '/add',
    '/add/:companyNumber',
  ])
  .get(populateForm, renderForm)
  .post(populateForm, handleFormPost, renderForm)

router
  .route('/:companyId/edit')
  .get(setIsEditMode, populateForm, renderForm)
  .post(setIsEditMode, populateForm, handleFormPost, renderForm)

router.post('/:companyId/archive', archiveCompany)
router.get('/:companyId/unarchive', unarchiveCompany)

router.use('/:companyId', setLocalNav(LOCAL_NAV))

router.get('/:companyId', redirectToFirstNavItem)
router.get('/:companyId/details', renderDetails)
router.get('/:companyId/contacts', renderContacts)
router.get('/:companyId/interactions',
  setInteractionsReturnUrl,
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractions
)
router.get('/:companyId/exports', renderExports)
router.get('/:companyId/investments', renderInvestments)
router.get('/:companyId/orders', renderOrders)
router.get('/:companyId/audit', renderAuditLog)

router.use('/:companyId', setInteractionsReturnUrl, setInteractionsEntityName, interactionsRouter)

module.exports = router
