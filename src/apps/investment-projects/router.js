const router = require('express').Router()

const { shared } = require('./middleware')
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
const requirementsMiddleware = require('./middleware/forms/requirements')
const interactionsMiddleware = require('./middleware/forms/interactions')

router.use(shared.handleEmptyMiddleware)
router.use(shared.getLocalNavMiddleware)

router.param('id', shared.getInvestmentDetails)
router.param('interactionId', shared.getInteractionDetails)

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

router.get('/:id', details.redirectToDetails)
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
  .get(requirementsMiddleware.populateForm, edit.editRequirementsGet)
  .post(requirementsMiddleware.populateForm, requirementsMiddleware.handleFormPost, edit.editRequirementsPost)

router.get('/:id/team', team.getTeamHandler)

router.get('/:id/interactions', interactions.list.indexGetHandler)

router
  .route('/:id/interactions/create')
  .get(interactionsMiddleware.populateForm, interactions.create.createGetInteractionHandler)
  .post(
    interactionsMiddleware.populateForm,
    interactionsMiddleware.handleFormPost,
    interactions.create.createPostInteractionHandler,
    interactions.create.createGetInteractionHandler
  )

router
  .route('/:id/evaluation')
  .get(evaluation.renderEvaluationPage)

router
  .route('/:id/interactions/:interactionId/edit')
  .get(interactionsMiddleware.populateForm, interactions.edit.editGetInteractionHandler)
  .post(
    interactionsMiddleware.populateForm,
    interactionsMiddleware.handleFormPost,
    interactions.edit.editPostInteractionHandler,
    interactions.edit.editGetInteractionHandler
  )

module.exports = router
