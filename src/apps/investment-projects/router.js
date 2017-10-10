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
const { getInvestmentProjectsCollection, getRequestBody } = require('./middleware/collection')

const { renderInteractionList } = require('./controllers/interactions')

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

router.use('/:id/', setLocalNav(LOCAL_NAV))

router.param('id', shared.getInvestmentDetails)
router.param('companyId', shared.getCompanyDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getInvestmentProjectsCollection, renderInvestmentList)

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

router.get('/:id/interactions', renderInteractionList)

router.get('/:id/evaluation', evaluation.renderEvaluationPage)

router.post('/:id/change-project-stage', projectStageFormMiddleware.handleFormPost)

module.exports = router
