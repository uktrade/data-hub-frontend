const { find, isUndefined, isNull, reject, pull } = require('lodash')
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
const { renderInteractions } = require('./controllers/interactions')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const { renderDocuments } = require('./controllers/documents')
const { renderSubsidiariesList, renderAddSubsidiary, renderAddGlobalHQ } = require('./controllers/subsidiaries')
const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./controllers/exports')
const { renderAccountManagementEditPage } = require('./controllers/account-management')

const { setDefaultQuery, setLocalNav, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('../interactions/middleware/collection')

const {
  getRequestBody,
  getCompanyCollection,
  getLimitedCompaniesCollection,
  getSubsidiaryCompaniesCollection,
  getSubsidiarySearchCompaniesCollection,
  getGlobalHQSearchCompaniesCollection,
  getGlobalHQ,
} = require('./middleware/collection')
const { setCompanyContactRequestBody, getCompanyContactCollection } = require('./middleware/contact-collection')
const { populateForm, handleFormPost, setIsEditMode } = require('./middleware/form')
const { getCompany, getCompaniesHouseRecord } = require('./middleware/params')
const { setInteractionsReturnUrl, setInteractionsEntityName } = require('./middleware/interactions')
const { populateAccountManagementForm, postAccountManagementDetails } = require('./middleware/account-management')
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

router.use('/:companyId', handleRoutePermissions(LOCAL_NAV),
  (req, res, next) => {
    // remove Subsidiaries from LOCAL_NAV for non headquarters companies
    const company = res.locals.company

    if (isNull(company.headquarter_type)) {
      const navWithoutSubsidiaries = reject(LOCAL_NAV, ['label', 'Subsidiaries'])
      setLocalNav(navWithoutSubsidiaries)(req, res, next)
    } else {
      setLocalNav(LOCAL_NAV)(req, res, next)
    }
  })

router.get('/:companyId', redirectToFirstNavItem)
router.get('/:companyId/details', renderDetails)
router.get('/:companyId/contacts',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  setCompanyContactRequestBody,
  getCompanyContactCollection,
  renderContacts
)
router.get('/:companyId/subsidiaries',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody,
  getSubsidiaryCompaniesCollection,
  renderSubsidiariesList
)

router.get('/:companyId/subsidiaries/add', getSubsidiarySearchCompaniesCollection, renderAddSubsidiary)

router.get('/:companyId/subsidiaries/add/:subsidiaryCompanyId', (req, res, next) => {
  // associate subsidiary with parent
  const parentCompany = res.locals.company
  const subsidiaryCompanyId = req.params.subsidiaryCompanyId
  let companySubsidiarySessionStore = find(req.session.subsidiaries, (company) => {
    return company.id === parentCompany.id
  })

  // remove subsidiaryCompanyId if it already exists
  req.session.subsidiaries.map((companySubsidiaryInfo) => {
    pull(companySubsidiaryInfo.subs, subsidiaryCompanyId)
  })

  // setup new parent company subsidiary object in the session
  if (isUndefined(companySubsidiarySessionStore)) {
    companySubsidiarySessionStore = {
      id: parentCompany.id,
      name: parentCompany.name,
      headquarter_type: parentCompany.headquarter_type,
      subs: [],
    }
    req.session.subsidiaries.push(companySubsidiarySessionStore)
  }

  companySubsidiarySessionStore.subs.unshift(subsidiaryCompanyId)

  req.flash('success', "You've linked a subsidiary")
  return res.redirect(`/companies/${parentCompany.id}/subsidiaries`)
})

router.get('/:companyId/subsidiaries/unlink/:subsidiaryCompanyId', (req, res, next) => {
  // associate subsidiary with parent
  const parentCompany = res.locals.company
  const subsidiaryCompanyId = req.params.subsidiaryCompanyId

  // remove subsidiaryCompanyId if it already exists
  req.session.subsidiaries.map((companySubsidiaryInfo) => {
    pull(companySubsidiaryInfo.subs, subsidiaryCompanyId)
  })

  res.locals.controlUrl = `/${parentCompany.id}/subsidiaries/unlink/${subsidiaryCompanyId}`

  req.session.undoUrl = `/companies/${parentCompany.id}/subsidiaries/add/${subsidiaryCompanyId}`
  req.flash('success', "You've removed the link to a subsidiary")
  return res.redirect(`/companies/${parentCompany.id}/subsidiaries`)
})

router.get('/:companyId/details/global-headquarters/add', getGlobalHQSearchCompaniesCollection, renderAddGlobalHQ)

router.get('/:companyId/details/global-headquarters/add/:globalHQCompanyId', getGlobalHQ, (req, res, next) => {
  // associate subsidiary with parent
  const subsidiaryCompanyId = req.params.companyId
  const globalHQCompanyId = req.params.globalHQCompanyId
  let companyGlobalHQSessionStore = find(req.session.subsidiaries, (company) => {
    return company.id === globalHQCompanyId
  })

  // remove subsidiaryCompanyId if it already exists
  if (req.session.subsidiaries.length) {
    req.session.subsidiaries.map((companySubsidiaryInfo) => {
      pull(companySubsidiaryInfo.subs, subsidiaryCompanyId)
    })
  }

  // setup new parent company subsidiary object in the session
  if (isUndefined(companyGlobalHQSessionStore)) {
    companyGlobalHQSessionStore = {
      id: globalHQCompanyId,
      name: res.locals.globalHQ.name,
      headquarter_type: res.locals.globalHQ.headquarter_type,
      subs: [],
    }

    req.session.subsidiaries.push(companyGlobalHQSessionStore)
  }

  companyGlobalHQSessionStore.subs.unshift(subsidiaryCompanyId)

  req.flash('success', "You've linked the Global HQ")
  return res.redirect(`/companies/${subsidiaryCompanyId}/details`)
})

router.get('/:companyId/details/global-headquarters/unlink/:globalHQCompanyId', (req, res, next) => {
  // associate subsidiary with parent
  const subsidiaryCompanyId = req.params.companyId
  const globalHQCompanyId = req.params.globalHQCompanyId

  // remove subsidiaryCompanyId if it already exists
  req.session.subsidiaries.map((companySubsidiaryInfo) => {
    pull(companySubsidiaryInfo.subs, subsidiaryCompanyId)
  })

  req.session.undoUrl = `/companies/${subsidiaryCompanyId}/details/global-headquarters/add/${globalHQCompanyId}`
  req.flash('success', "You've removed the link to Global HQ")
  return res.redirect(`/companies/${subsidiaryCompanyId}/details`)
})

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
router.get('/:companyId/documents', renderDocuments)

router.use('/:companyId', setInteractionsReturnUrl, setInteractionsEntityName, interactionsRouter)

module.exports = router
