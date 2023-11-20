const router = require('express').Router()

const urls = require('../../lib/urls')

const { LOCAL_NAV, APP_PERMISSIONS, QUERY_FIELDS } = require('./constants')

const setReturnUrl = require('./middleware/set-return-url')
const { getRequestBody } = require('../../middleware/collection')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

const { renderDetails } = require('./controllers/details')

const { renderBusinessDetails } = require('./apps/business-details/controllers')

const { renderOrders } = require('./controllers/orders')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const { renderSubsidiaries } = require('./controllers/subsidiaries')

const {
  redirectToFirstNavItem,
  handleRoutePermissions,
  setLocalNav,
} = require('../middleware')

const {
  getCompany,
  setIsCompanyAlreadyAdded,
  addCompanyOrRemoveFromList,
} = require('./middleware/params')
const { setInteractionsDetails } = require('./middleware/interactions')
const {
  setGlobalHQ,
  removeGlobalHQ,
  addSubsidiary,
} = require('./middleware/hierarchies')
const lastInteractionDate = require('./middleware/last-interaction-date')
const formatPostcodes = require('./middleware/format-postcodes')

const addCompanyFormRouter = require('./apps/add-company/router')
const editCompanyFormRouter = require('./apps/edit-company/router')
const activityFeedRouter = require('./apps/activity-feed/router')
const companyOverviewRouter = require('./apps/company-overview/router')
const dnbHierarchyRouter = require('./apps/dnb-hierarchy/router')
const businessDetailsRouter = require('./apps/business-details/router')
const editHistoryRouter = require('./apps/edit-history/router')
const matchCompanyRouter = require('./apps/match-company/router')
const exportsRouter = require('./apps/exports/router')
const investmentsRouter = require('./apps/investments/router')
const interactionsRouter = require('../interactions/router.sub-app')
const companyListsRouter = require('../company-lists/router')
const referralsRouter = require('./apps/referrals/router')
const accountManagementRouter = require('./apps/account-management/router')

const {
  setCompanyHierarchyLocalNav,
  setDnbHierarchyDetails,
} = require('./apps/dnb-hierarchy/middleware')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('companyId', getCompany)
router.param('companyId', setIsCompanyAlreadyAdded)
router.param('companyId', setDnbHierarchyDetails)

router.get(
  urls.companies.export.route,
  getRequestBody(QUERY_FIELDS),
  lastInteractionDate,
  formatPostcodes,
  exportCollection('company')
)

router.use(urls.companies.create.route, addCompanyFormRouter)
router.use(urls.companies.lists.index.route, companyListsRouter)
router.use(urls.companies.edit.route, editCompanyFormRouter)
router.use(urls.companies.editHistory.index.route, editHistoryRouter)

router.post(urls.companies.archive.route, archiveCompany)
router.get(urls.companies.unarchive.route, unarchiveCompany)

router.use(
  urls.companies.detail.route,
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)
router.get(urls.companies.detail.route, redirectToFirstNavItem)
router.get(urls.companies.details.route, renderDetails)

router.get(urls.companies.businessDetails.route, renderBusinessDetails)

router.get(urls.companies.hierarchies.ghq.add.route, setGlobalHQ)
router.get(urls.companies.hierarchies.ghq.remove.route, removeGlobalHQ)

router.get(urls.companies.hierarchies.subsidiaries.add.route, addSubsidiary)

router.get(urls.companies.contacts.route, setReturnUrl, renderContacts)

router.get(urls.companies.orders.route, setReturnUrl, renderOrders)
router.use(
  urls.companies.investments.companyInvestment.route,
  setReturnUrl,
  investmentsRouter
)
router.use(
  urls.companies.interactions.index.route,
  setInteractionsDetails,
  interactionsRouter
)

router.post(urls.companies.manageCompanyList.route, addCompanyOrRemoveFromList)

router.use(urls.companies.subsidiaries.index.route, setCompanyHierarchyLocalNav)
router.get(urls.companies.subsidiaries.index.route, renderSubsidiaries)

router.use(activityFeedRouter)
router.use(dnbHierarchyRouter)
router.use(businessDetailsRouter)
router.use(matchCompanyRouter)
router.use(exportsRouter)
router.use(referralsRouter)
router.use(companyOverviewRouter)
router.use(accountManagementRouter)

module.exports = router
