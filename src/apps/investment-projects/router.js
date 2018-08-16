const router = require('express').Router()

const { ENTITIES } = require('../search/constants')
const { DEFAULT_COLLECTION_QUERY, LOCAL_NAV, APP_PERMISSIONS, QUERY_FIELDS } = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const { getCollection } = require('../../modules/search/middleware/collection')

const { setLocalNav, setDefaultQuery, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')
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
  documents,
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
} = require('./middleware/forms')

const { renderInvestmentList } = require('./controllers/list')
const { renderInteractionList } = require('./controllers/interactions')
const { renderPropositionList } = require('./controllers/propositions')
const { renderEvidenceView } = require('./controllers/evidence')
const { renderAddEvidence } = require('./apps/evidence/controllers/create')
const { collectEvidenceFields } = require('./middleware/evidence')
const { postUpload } = require('../document-upload/middleware/upload-module')

const { setInteractionsReturnUrl, setInteractionsEntityName, setCompanyDetails } = require('./middleware/interactions')
const { setPropositionsReturnUrl } = require('./middleware/propositions')
const { setEvidenceReturnUrl, getDownloadLink, deleteEvidence } = require('./middleware/evidence')

const { renderTeamEdit } = require('./controllers/team/edit-team-members')
const { populateTeamEditForm, postTeamEdit } = require('./middleware/forms/team-members')

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

const { transformInvestmentProjectToListItem } = require('./transformers')

const interactionsRouter = require('../interactions/router.sub-app')
const propositionsRouter = require('../propositions/router.sub-app')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.use('/:investmentId', setLocalNav(LOCAL_NAV))

router.param('investmentId', shared.getInvestmentDetails)
router.param('companyId', shared.getCompanyDetails)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  getCollection('investment_project', ENTITIES, transformInvestmentProjectToListItem),
  renderInvestmentList
)

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
  .post(valueFormMiddleware.populateForm, valueFormMiddleware.handleFormPost, edit.renderValueForm)

router
  .route('/:investmentId/edit-requirements')
  .get(requirementsFormMiddleware.populateForm, edit.renderRequirementsForm)
  .post(requirementsFormMiddleware.handleFormPost, requirementsFormMiddleware.populateForm, edit.renderRequirementsForm)

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
  .get(populateTeamEditForm, renderTeamEdit)
  .post(postTeamEdit, renderTeamEdit)

router.get('/:investmentId/interactions', setInteractionsReturnUrl, renderInteractionList)

router.get('/:investmentId/propositions', setPropositionsReturnUrl, renderPropositionList)

router.get('/:investmentId/evaluation', evaluation.renderEvaluationPage)

router.get('/:investmentId/evidence', setEvidenceReturnUrl, renderEvidenceView)

router
  .route('/:investmentId/evidence/add-new')
  .get(
    setEvidenceReturnUrl,
    renderAddEvidence,
  )
  .post(
    setEvidenceReturnUrl,
    postUpload.bind({
      url: {
        app: 'investment',
        document: 'evidence-document',
      },
      collectTextFields: collectEvidenceFields,
    }),
  )

router
  .route('/:investmentId/evidence/:evidenceId/download')
  .get(
    getDownloadLink
  )

router
  .route('/:investmentId/evidence/:evidenceId/delete')
  .get(
    setEvidenceReturnUrl,
    deleteEvidence
  )

router.post('/:investmentId/change-project-stage', projectStageFormMiddleware.handleFormPost)

router.use('/:investmentId', setInteractionsReturnUrl, setInteractionsEntityName, setCompanyDetails, interactionsRouter)

router.use('/:investmentId', setPropositionsReturnUrl, propositionsRouter)

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

router.get('/:investmentId/documents', documents.renderDocuments)

module.exports = router
