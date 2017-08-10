const router = require('express').Router()

const { setLocalNav, setDefaultQuery, redirectToFirstNavItem } = require('../middleware')
const { shared } = require('./middleware')
const {
  getBriefInvestmentSummary,
  expandTeamMembers,
} = require('./middleware/team')

const {
  createStep1,
  createStep2,
  archive,
  audit,
  details,
  edit,
  evaluation,
  team,
  interactions,
} = require('./controllers')

const detailsFormMiddleware = require('./middleware/forms/details')
const valueFormMiddleware = require('./middleware/forms/value')
const requirementsFormMiddleware = require('./middleware/forms/requirements')
const interactionsFormMiddleware = require('./middleware/forms/interactions')
const projectManagementFormMiddleware = require('./middleware/forms/project-management')
const clientRelationshipManagementFormMiddleware = require('./middleware/forms/client-relationship-management')
const teamMembersFormMiddleware = require('./middleware/forms/team-members')
const { renderInvestmentList } = require('./controllers/list')
const { getInvestmentProjectsCollection, getRequestBody } = require('./middleware/collection')

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
}

router.use('/:id/', setLocalNav(LOCAL_NAV))

router.param('id', shared.getInvestmentDetails)
router.param('interactionId', shared.getInteractionDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getInvestmentProjectsCollection, renderInvestmentList)

router.post('/:id/details', archive.archiveInvestmentProjectHandler, details.detailsGetHandler)
router.get('/:id/unarchive', archive.unarchiveInvestmentProjectHandler)

router.get('/:id/audit', audit.getInvestmentAudit)

router.get('/create', (req, res) => { res.redirect('create/1') })

router
  .route('/create/1')
  .get(createStep1.getHandler)
  .post(createStep1.postHandler)

router
  .route('/create/2')
  .get(detailsFormMiddleware.populateForm, createStep2.createGetHandler)
  .post(detailsFormMiddleware.populateForm, detailsFormMiddleware.handleFormPost, createStep2.createPostHandler)

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
