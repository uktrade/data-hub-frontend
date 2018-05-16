const router = require('express').Router()

const { LOCAL_NAV, DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS } = require('./constants')
const {
  renderAddStepOne,
  postAddStepOne,
  renderAddStepTwo,
} = require('./controllers/add')

const { renderCompanyList } = require('./controllers/list')
const { renderForm } = require('./controllers/edit')
const { renderDetails } = require('./controllers/details')
const { renderInvestments } = require('./controllers/investments')
const { renderOrders } = require('./controllers/orders')
const { renderAuditLog } = require('./controllers/audit')
const { renderTimeline } = require('./controllers/timeline')
const { renderInteractions } = require('./controllers/interactions')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const { renderDocuments } = require('./controllers/documents')
const { renderAddGlobalHQ } = require('./controllers/hierarchies')
const { renderSubsidiaries } = require('./controllers/subsidiaries')
const { renderLinkSubsidiary } = require('./controllers/subsidiaryLink')

const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./controllers/exports')
const { renderAccountManagementEditPage } = require('./controllers/account-management')

const { setDefaultQuery, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('../interactions/middleware/collection')

const {
  getRequestBody,
  getCompanyCollection,
  getLimitedCompaniesCollection,
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
} = require('./middleware/collection')

const { setCompanyContactRequestBody, getCompanyContactCollection } = require('./middleware/contact-collection')
const { populateForm, handleFormPost, setIsEditMode } = require('./middleware/form')
const { getCompany, getCompaniesHouseRecord } = require('./middleware/params')
const { setInteractionsReturnUrl, setInteractionsEntityName } = require('./middleware/interactions')
const { populateAccountManagementForm, postAccountManagementDetails } = require('./middleware/account-management')
const { setGlobalHQ, removeGlobalHQ, setSubsidiary, removeSubsidiary } = require('./middleware/hierarchies')
const setCompaniesLocalNav = require('./middleware/local-navigation')

const interactionsRouter = require('../interactions/router.sub-app')

router.use(handleRoutePermissions(APP_PERMISSIONS))

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
  .post(handleFormPost, populateForm, renderForm)

router
  .route('/:companyId/edit')
  .get(setIsEditMode, populateForm, renderForm)
  .post(handleFormPost, setIsEditMode, populateForm, renderForm)

router
  .route('/:companyId/account-management/edit')
  .get(populateAccountManagementForm, renderAccountManagementEditPage)
  .post(populateAccountManagementForm, postAccountManagementDetails, renderAccountManagementEditPage)

router.post('/:companyId/archive', archiveCompany)
router.get('/:companyId/unarchive', unarchiveCompany)

router.use('/:companyId', handleRoutePermissions(LOCAL_NAV), setCompaniesLocalNav)

router.get('/:companyId', redirectToFirstNavItem)
router.get('/:companyId/details', renderDetails)

router.get('/:companyId/hierarchies/ghq/search', getGlobalHQCompaniesCollection, renderAddGlobalHQ)
router.get('/:companyId/hierarchies/ghq/:globalHqId/add', setGlobalHQ)
router.get('/:companyId/hierarchies/ghq/remove', removeGlobalHQ)

router.get('/:companyId/hierarchies/subsidiaries/search', getSubsidiaryCompaniesCollection, renderLinkSubsidiary)
router.get('/:parentCompanyId/hierarchies/subsidiaries/:companyId/add', setSubsidiary)
router.get('/:parentCompanyId/hierarchies/subsidiaries/remove', removeSubsidiary)

router.get('/:companyId/contacts',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  setCompanyContactRequestBody,
  getCompanyContactCollection,
  renderContacts
)

router.get('/:companyId/interactions',
  setInteractionsReturnUrl,
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractions
)
router.get('/:companyId/exports', renderExports)
router.get('/:companyId/subsidiaries', renderSubsidiaries)
router.get('/:companyId/subsidiaries/link', renderLinkSubsidiary)
router.get('/:companyId/investments', renderInvestments)
router.get('/:companyId/orders', renderOrders)
router.get('/:companyId/audit', renderAuditLog)
router.get('/:companyId/documents', renderDocuments)
router.get('/:companyId/timeline', renderTimeline)

router.use('/:companyId', setInteractionsReturnUrl, setInteractionsEntityName, interactionsRouter)

module.exports = router
