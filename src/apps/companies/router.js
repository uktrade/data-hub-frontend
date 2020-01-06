const router = require('express').Router()

const urls = require('../../lib/urls')

const { ENTITIES } = require('../search/constants')
const { LOCAL_NAV, DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS, QUERY_FIELDS } = require('./constants')

const setRetunUrl = require('./middleware/set-return-url')
const { getRequestBody } = require('../../middleware/collection')
const { getCollection, exportCollection } = require('../../modules/search/middleware/collection')

const { renderCompanyList } = require('./controllers/list')
const { renderDetails } = require('./controllers/details')

const { renderBusinessDetails } = require('./apps/business-details/controllers')

const { renderOrders } = require('./controllers/orders')
const { renderAuditLog } = require('./controllers/audit')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const { renderDocuments } = require('./controllers/documents')
const { renderAddGlobalHQ } = require('./controllers/hierarchies')
const { renderSubsidiaries } = require('./controllers/subsidiaries')
const { renderLinkSubsidiary } = require('./controllers/subsidiary-link')

const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./controllers/exports')

const {
  setDefaultQuery,
  redirectToFirstNavItem,
  handleRoutePermissions,
} = require('../middleware')

const {
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
} = require('./middleware/collection')

const { setCompanyContactRequestBody, getCompanyContactCollection } = require('./middleware/contact-collection')
const { getCompany, setIsCompanyAlreadyAdded, addCompanyOrRemoveFromList } = require('./middleware/params')
const { setInteractionsDetails } = require('./middleware/interactions')
const { setGlobalHQ, removeGlobalHQ, addSubsidiary } = require('./middleware/hierarchies')
const setCompaniesLocalNav = require('./middleware/local-navigation')
const lastInteractionDate = require('./middleware/last-interaction-date')

const { transformCompanyToListItem } = require('./transformers')

const addCompanyFormRouter = require('./apps/add-company/router')
const editCompanyFormRouter = require('./apps/edit-company/router')
const activityFeedRouter = require('./apps/activity-feed/router')
const dnbHierarchyRouter = require('./apps/dnb-hierarchy/router')
const businessDetailsRouter = require('./apps/business-details/router')
const editHistoryRouter = require('./apps/edit-history/router')

const investmentsRouter = require('./apps/investments/router')
const matchingRouter = require('./apps/matching/router')
const interactionsRouter = require('../interactions/router.sub-app')
const companyListsRouter = require('../company-lists/router')
const advisersRouter = require('./apps/advisers/router')

const {
  setCompanyHierarchyLocalNav,
  setDnbHierarchyDetails,
} = require('./apps/dnb-hierarchy/middleware')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('companyId', getCompany)
router.param('companyId', setIsCompanyAlreadyAdded)
router.param('companyId', setDnbHierarchyDetails)

router.get(urls.companies.index.route,
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  lastInteractionDate,
  getCollection('company', ENTITIES, transformCompanyToListItem),
  renderCompanyList,
)

router.get('/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  lastInteractionDate,
  exportCollection('company'),
)

router.use('/create', addCompanyFormRouter)
router.use('/:companyId/lists', companyListsRouter)
router.use('/:companyId/edit', editCompanyFormRouter)
router.use('/:companyId/edit-history', editHistoryRouter)

router.post('/:companyId/archive', archiveCompany)
router.get('/:companyId/unarchive', unarchiveCompany)

router.use('/:companyId', handleRoutePermissions(LOCAL_NAV), setCompaniesLocalNav)
router.get('/:companyId', redirectToFirstNavItem)
router.get('/:companyId/details', renderDetails)

router.get(urls.companies.exports.index.route, setRetunUrl, renderExports)
router
  .route(urls.companies.exports.edit.route)
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

router.get(urls.companies.exports.index.route, renderExports)
router
  .route(urls.companies.exports.edit.route)
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

router.get(urls.companies.businessDetails.route, renderBusinessDetails)

router.get('/:companyId/hierarchies/ghq/search', getGlobalHQCompaniesCollection, renderAddGlobalHQ)
router.get(urls.companies.hierarchies.ghq.add.route, setGlobalHQ)
router.get('/:companyId/hierarchies/ghq/remove', removeGlobalHQ)

router.get('/:companyId/hierarchies/subsidiaries/search', getSubsidiaryCompaniesCollection, renderLinkSubsidiary)
router.get('/:companyId/hierarchies/subsidiaries/:subsidiaryCompanyId/add', addSubsidiary)

router.get('/:companyId/contacts',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  setCompanyContactRequestBody,
  getCompanyContactCollection,
  setRetunUrl,
  renderContacts
)

router.get('/:companyId/orders', setRetunUrl, renderOrders)
router.get('/:companyId/audit', renderAuditLog)
router.get('/:companyId/documents', renderDocuments)
router.use('/:companyId/investments', setRetunUrl, investmentsRouter)
router.use('/:companyId/matching', matchingRouter)
router.use('/:companyId', setInteractionsDetails, interactionsRouter)
router.use('/:companyId/advisers', setRetunUrl, advisersRouter)

router.post('/:companyId/manage-company-list', addCompanyOrRemoveFromList)

router.use('/:companyId/subsidiaries', setCompanyHierarchyLocalNav)
router.get('/:companyId/subsidiaries', renderSubsidiaries)
router.get('/:companyId/subsidiaries/link', renderLinkSubsidiary)

router.use(activityFeedRouter)

router.use(dnbHierarchyRouter)

router.use(businessDetailsRouter)

module.exports = router
