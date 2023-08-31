const router = require('express').Router()

const urls = require('../../lib/urls')

const {
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
} = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

const setInvestmentTabItems = require('./middleware/investments-tab-items')
const setLocalNavigation = require('./middleware/local-navigation')
const {
  redirectToFirstNavItem,
  handleRoutePermissions,
} = require('../middleware')
const { shared } = require('./middleware')

const {
  create,
  archive,
  editHistory,
  documents,
  edit,
  evaluation,
  team,
} = require('./controllers')

const { renderProjectsView } = require('./controllers/projects')
const { renderPropositionList } = require('./controllers/propositions')
const { renderAdminView } = require('./controllers/admin')
const { renderEvidenceView } = require('./controllers/evidence')
const { renderAddEvidence } = require('./apps/evidence/controllers/create')
const { postUpload } = require('../documents/middleware/upload')

const { setCompanyDetails } = require('./middleware/interactions')
const { setPropositionsReturnUrl } = require('./middleware/propositions')
const {
  setEvidenceReturnUrl,
  setEvidenceDocumentsOptions,
  getDownloadLink,
  deleteEvidence,
} = require('./middleware/evidence')

const { renderTeamEdit } = require('./controllers/team/edit-team-members')

const interactionsRouter = require('../interactions/router.sub-app')
const propositionsRouter = require('../propositions/router.sub-app')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.use('/:investmentId', setLocalNavigation)
router.param('investmentId', shared.getInvestmentDetails)
router.param('companyId', shared.getCompanyDetails)

router.get('/', setInvestmentTabItems, renderProjectsView)

router.get(
  '/export',
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  exportCollection('investment_project')
)

router.get(
  '/:investmentId/unarchive',
  archive.unarchiveInvestmentProjectHandler
)

router.get(
  urls.investments.editHistory.index.route,
  editHistory.renderProjectsView
)
router.get(
  urls.investments.editHistory.data.route,
  editHistory.fetchProjectsHistoryHandler
)

// Add investment from Companies
router.get('/create/:companyId?', create.start.renderCreatePage)

// Add investment from Investments
router.get('/create', create.start.renderCreatePage)

router.get('/:investmentId', redirectToFirstNavItem)

router.route('/:investmentId/edit-value').get(edit.renderValueForm)

router
  .route('/:investmentId/edit-requirements')
  .get(edit.renderRequirementsForm)

router
  .route('/:investmentId/edit-project-management')
  .get(team.editProjectManagement.editProjectManagementHandler)
  .post(
    team.editProjectManagement.postHandler,
    team.editProjectManagement.getHandler
  )

router
  .route('/:investmentId/edit-client-relationship-management')
  .get(team.editClientRelationshipManagement.getHandler)

router.route('/:investmentId/edit-team-members').get(renderTeamEdit)

router.get(
  '/:investmentId/propositions',
  setPropositionsReturnUrl,
  renderPropositionList
)

router.get('/:investmentId/evaluation', evaluation.renderEvaluationPage)

router.get('/:investmentId/evidence', setEvidenceReturnUrl, renderEvidenceView)

router
  .route('/:investmentId/evidence/add-new')
  .get(setEvidenceReturnUrl, renderAddEvidence)
  .post(setEvidenceReturnUrl, setEvidenceDocumentsOptions, postUpload)

router
  .route('/:investmentId/evidence/:evidenceId/download')
  .get(getDownloadLink)

router
  .route('/:investmentId/evidence/:evidenceId/delete')
  .get(setEvidenceReturnUrl, deleteEvidence)

router.use(
  urls.investments.projects.interactions.index.route,
  setCompanyDetails,
  interactionsRouter
)

router.use('/:investmentId', setPropositionsReturnUrl, propositionsRouter)

router.get('/:investmentId/documents', documents.renderDocuments)

router.get('/:investmentId/admin', renderAdminView)

module.exports = router
