const router = require('express').Router()

const urls = require('../../lib/urls')

const { LOCAL_NAV, APP_PERMISSIONS, QUERY_FIELDS } = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

const { renderDetails } = require('./controllers/details')

const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
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
const { addSubsidiary } = require('./middleware/hierarchies')
const lastInteractionDate = require('./middleware/last-interaction-date')
const formatPostcodes = require('./middleware/format-postcodes')

const addCompanyFormRouter = require('./apps/add-company/router')
const editCompanyFormRouter = require('./apps/edit-company/router')
const matchCompanyRouter = require('./apps/match-company/router')
const interactionsRouter = require('../interactions/router.sub-app')
const companyListsRouter = require('../company-lists/router')
const referralsRouter = require('./apps/referrals/router')
const accountManagementRouter = require('./apps/account-management/router')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('companyId', getCompany)
router.param('companyId', setIsCompanyAlreadyAdded)

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

router.post(urls.companies.archive.route, archiveCompany)
router.get(urls.companies.unarchive.route, unarchiveCompany)

router.use(
  urls.companies.detail.route,
  handleRoutePermissions(LOCAL_NAV),
  setLocalNav(LOCAL_NAV)
)
router.get(urls.companies.detail.route, redirectToFirstNavItem)
router.get(urls.companies.details.route, renderDetails)

router.get(urls.companies.hierarchies.subsidiaries.add.route, addSubsidiary)

router.use(
  urls.companies.interactions.index.route,
  setInteractionsDetails,
  interactionsRouter
)

router.post(urls.companies.manageCompanyList.route, addCompanyOrRemoveFromList)

router.get(urls.companies.subsidiaries.index.route, renderSubsidiaries)

router.use(matchCompanyRouter)
router.use(referralsRouter)
router.use(accountManagementRouter)

module.exports = router
