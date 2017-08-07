const router = require('express').Router()

const { setLocalNav, redirectToFirstNavItem } = require('../middleware')
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
  interactions,
} = require('./controllers')
const {
  clientRelationshipManagementFormMiddleware,
  detailsFormMiddleware,
  interactionsFormMiddleware,
  investmentTypeFormMiddleware,
  projectManagementFormMiddleware,
  requirementsFormMiddleware,
  valueFormMiddleware,
  teamMembersFormMiddleware,
} = require('./middleware/forms')
const { renderInvestmentList } = require('./controllers/list')
const { handleDefaultFilters, getInvestmentProjectsCollection, getRequestBody } = require('./middleware/collection')

const LOCAL_NAV = [
  { path: 'details', label: 'Project details' },
  { path: 'team', label: 'Project team' },
  { path: 'interactions', label: 'Interactions' },
  { path: 'evaluation', label: 'Evaluations' },
  { path: 'audit', label: 'Audit history' },
]

router.use('/:id/', setLocalNav(LOCAL_NAV))

router.param('id', shared.getInvestmentDetails)
router.param('interactionId', shared.getInteractionDetails)
router.param('companyId', shared.getCompanyDetails)

router.get('/', handleDefaultFilters, getRequestBody, getInvestmentProjectsCollection, renderInvestmentList)

router.post('/:id/details', archive.archiveInvestmentProjectHandler, details.detailsGetHandler)
router.get('/:id/unarchive', archive.unarchiveInvestmentProjectHandler)

router.get('/:id/audit', audit.getInvestmentAudit)

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

router.get('/:id', redirectToFirstNavItem)
router.get('/:id/details', details.detailsGetHandler)

router
  .route('/:id/edit-details')
  .get(detailsFormMiddleware.populateForm, edit.editDetailsGet)
  .post(detailsFormMiddleware.populateForm, detailsFormMiddleware.handleFormPost, edit.editDetailsPost)

router
  .route('/:id/edit-value')
  .get(valueFormMiddleware.populateForm, edit.editValueGet)
  .post(valueFormMiddleware.populateForm, valueFormMiddleware.handleFormPost, edit.editValuePost)

router
  .route('/:id/edit-requirements')
  .get(requirementsFormMiddleware.populateForm, edit.editRequirementsGet)
  .post(requirementsFormMiddleware.populateForm, requirementsFormMiddleware.handleFormPost, edit.editRequirementsPost)

router.get('/:id/team', expandTeamMembers, team.details.getDetailsHandler)

router
  .route('/:id/edit-project-management')
  .get(getBriefInvestmentSummary, projectManagementFormMiddleware.populateForm, team.editProjectManagement.getHandler)
  .post(
    getBriefInvestmentSummary,
    projectManagementFormMiddleware.populateForm,
    projectManagementFormMiddleware.handleFormPost,
    team.editProjectManagement.postHandler,
    team.editProjectManagement.getHandler
  )

router
  .route('/:id/edit-client-relationship-management')
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
  .route('/:id/edit-team-members')
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

router.get('/:id/interactions', interactions.list.indexGetHandler)

router
  .route('/:id/interactions/create')
  .get(interactionsFormMiddleware.populateForm, interactions.create.createGetInteractionHandler)
  .post(
    interactionsFormMiddleware.populateForm,
    interactionsFormMiddleware.handleFormPost,
    interactions.create.createPostInteractionHandler,
    interactions.create.createGetInteractionHandler
  )

router.get('/:id/evaluation', evaluation.renderEvaluationPage)

router
  .route('/:id/interactions/:interactionId/edit')
  .get(interactionsFormMiddleware.populateForm, interactions.edit.editGetInteractionHandler)
  .post(
    interactionsFormMiddleware.populateForm,
    interactionsFormMiddleware.handleFormPost,
    interactions.edit.editPostInteractionHandler,
    interactions.edit.editGetInteractionHandler
  )

module.exports = router
