const router = require('express').Router()

const { setLocalNav, setDefaultQuery, redirectToFirstNavItem } = require('../middleware')
const { shared } = require('./middleware')
const {
  getBriefInvestmentSummary,
  expandTeamMembers,
} = require('./middleware/team')

const {
  create,
  archive,
  audit,
  details,
  edit,
  evaluation,
  team,
} = require('./controllers')

const {
  clientRelationshipManagementFormMiddleware,
  detailsFormMiddleware,
  investmentTypeFormMiddleware,
  projectManagementFormMiddleware,
  projectStageFormMiddleware,
  requirementsFormMiddleware,
  valueFormMiddleware,
  teamMembersFormMiddleware,
} = require('./middleware/forms')

const { renderInvestmentList } = require('./controllers/list')
const { renderInteractionList } = require('./controllers/interactions')

const { getInvestmentProjectsCollection, getRequestBody } = require('./middleware/collection')
const { setInteractionsReturnUrl, setInteractionsEntityName, setCompanyDetails } = require('./middleware/interactions')

const {
  renderStatusPage,
  postStatus,
} = require('./controllers/status')

const {
  selectUKCompany,
  searchForUKCompany,
  renderCompanyResults,
  removeUKCompany,
} = require('./controllers/ukcompany')

const {
  selectAssociatedInvestmentProject,
  searchForAssociatedInvestmentProject,
  renderAssociatedInvestmentProjectResults,
  removeAssociatedInvestmentProject,
} = require('./controllers/associated')

const interactionsRouter = require('../interactions/router.sub-app')

const LOCAL_NAV = [
  { path: 'details', label: 'Project details' },
  { path: 'team', label: 'Project team' },
  { path: 'interactions', label: 'Interactions' },
  { path: 'evaluation', label: 'Evaluations' },
  { path: 'audit', label: 'Audit history' },
]

const currentYear = (new Date()).getFullYear()
const DEFAULT_COLLECTION_QUERY = {
  estimated_land_date_after: `${currentYear}-04-05`,
  estimated_land_date_before: `${currentYear + 1}-04-06`,
  sortby: 'estimated_land_date:asc',
}

router.use('/:investmentId/', setLocalNav(LOCAL_NAV))

router.param('investmentId', shared.getInvestmentDetails)
router.param('companyId', shared.getCompanyDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getInvestmentProjectsCollection, renderInvestmentList)

router.post('/:investmentId/details', archive.archiveInvestmentProjectHandler, details.detailsGetHandler)
router.get('/:investmentId/unarchive', archive.unarchiveInvestmentProjectHandler)

router.get('/:investmentId/audit', audit.getInvestmentAudit)

router.get('/create/:companyId?', create.start.redirectHandler, create.start.renderCreatePage)

router.get('/create/investment-type/info', create.investmentType.renderInvestmentInfoPage)

router
  .route('/create/investment-type/:companyId')
  .get(investmentTypeFormMiddleware.populateForm, create.investmentType.renderInvestmentTypePage)
  .post(
    investmentTypeFormMiddleware.validateForm,
    create.investmentType.postHandler,
    investmentTypeFormMiddleware.populateForm,
    create.investmentType.renderInvestmentTypePage
  )

router
  .route('/create/equity-source/:companyId')
  .get(create.equitySource.getHandler, create.equitySource.renderEquitySourcePage)
  .post(
    create.equitySource.postHandler,
    create.equitySource.getHandler,
    create.equitySource.renderEquitySourcePage
  )

router
  .route('/create/project/:equityCompanyId')
  .get(
    detailsFormMiddleware.populateForm,
    create.project.getHandler,
    create.project.renderCreateProjectPage
  )
  .post(
    detailsFormMiddleware.populateForm,
    detailsFormMiddleware.handleFormPost,
    detailsFormMiddleware.validateForm,
    create.project.postHandler,
    create.project.getHandler,
    create.project.renderCreateProjectPage
  )

router.get('/:investmentId', redirectToFirstNavItem)
router.get('/:investmentId/details', details.detailsGetHandler)

router
  .route('/:investmentId/edit-details')
  .get(detailsFormMiddleware.populateForm, edit.editDetailsGet)
  .post(detailsFormMiddleware.populateForm, detailsFormMiddleware.handleFormPost, edit.editDetailsPost, edit.editDetailsGet)

router
  .route('/:investmentId/edit-value')
  .get(valueFormMiddleware.populateForm, edit.editValueGet)
  .post(valueFormMiddleware.populateForm, valueFormMiddleware.handleFormPost, edit.editValuePost)

router
  .route('/:investmentId/edit-requirements')
  .get(requirementsFormMiddleware.populateForm, edit.editRequirementsGet)
  .post(requirementsFormMiddleware.populateForm, requirementsFormMiddleware.handleFormPost, edit.editRequirementsPost)

router.get('/:investmentId/team', expandTeamMembers, team.details.getDetailsHandler)

router
  .route('/:investmentId/edit-project-management')
  .get(getBriefInvestmentSummary, projectManagementFormMiddleware.populateForm, team.editProjectManagement.getHandler)
  .post(
    getBriefInvestmentSummary,
    projectManagementFormMiddleware.populateForm,
    projectManagementFormMiddleware.handleFormPost,
    team.editProjectManagement.postHandler,
    team.editProjectManagement.getHandler
  )

router
  .route('/:investmentId/edit-client-relationship-management')
  .get(
    clientRelationshipManagementFormMiddleware.populateForm,
    team.editClientRelationshipManagement.getHandler
  )
  .post(
    clientRelationshipManagementFormMiddleware.populateForm,
    clientRelationshipManagementFormMiddleware.handleFormPost,
    team.editClientRelationshipManagement.postHandler,
    team.editClientRelationshipManagement.getHandler
  )

router
  .route('/:investmentId/edit-team-members')
  .get(
    teamMembersFormMiddleware.populateForm,
    team.editTeamMembers.getHandler
  )
  .post(
    teamMembersFormMiddleware.populateForm,
    teamMembersFormMiddleware.handleFormPost,
    team.editTeamMembers.postHandler,
    team.editTeamMembers.getHandler
  )

router.get('/:investmentId/interactions', setInteractionsReturnUrl, renderInteractionList)

router.get('/:investmentId/evaluation', evaluation.renderEvaluationPage)

router.post('/:investmentId/change-project-stage', projectStageFormMiddleware.handleFormPost)

router.use('/:investmentId', setInteractionsReturnUrl, setInteractionsEntityName, setCompanyDetails, interactionsRouter)

router
  .route('/:investmentId/status')
  .post(postStatus, renderStatusPage)
  .get(renderStatusPage)

router.get('/:investmentId/edit-ukcompany', selectUKCompany, searchForUKCompany, renderCompanyResults)
router.get('/:investmentId/remove-ukcompany', removeUKCompany)

// Todo - DH-1030
// Currently to associate the user you must click a link in the investment details page after
// indicating there is an association with a non-fdi r&d project
// Review the investment flow later to see if this can be improved.

router.get('/:investmentId/edit-associated',
  selectAssociatedInvestmentProject,
  searchForAssociatedInvestmentProject,
  renderAssociatedInvestmentProjectResults
)

router.get('/:investmentId/remove-associated', removeAssociatedInvestmentProject)

module.exports = router
