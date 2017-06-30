const router = require('express').Router()

const {
  shared,
  form,
} = require('./middleware')
const {
  archive,
  audit,
  create,
  details,
  edit,
  start,
  team,
  interactions,
} = require('./controllers')

router.use(shared.handleEmptyMiddleware)
router.use(shared.getLocalNavMiddleware)

router.param('id', shared.getProjectDetails)
router.param('interactionId', shared.getInteractionDetails)

router.post('/:id/details', archive.archiveInvestmentProjectHandler, details.detailsGetHandler)
router.get('/:id/unarchive', archive.unarchiveInvestmentProjectHandler)

router.get('/:id/audit', audit.getInvestmentAudit)

router
  .route('/create')
  .get(form.populateDetailsFormMiddleware, create.createGetHandler)
  .post(form.populateDetailsFormMiddleware, form.investmentDetailsFormPostMiddleware, create.createPostHandler)

router
  .route('/start')
  .get(start.getHandler)
  .post(start.postHandler)

router.get('/:id', details.redirectToDetails)
router.get('/:id/details', details.detailsGetHandler)

router
  .route('/:id/edit-details')
  .get(form.populateDetailsFormMiddleware, edit.editDetailsGet)
  .post(form.populateDetailsFormMiddleware, form.investmentDetailsFormPostMiddleware, edit.editDetailsPost)

router
  .route('/:id/edit-value')
  .get(form.populateValueFormMiddleware, edit.editValueGet)
  .post(form.populateValueFormMiddleware, form.investmentValueFormPostMiddleware, edit.editValuePost)

router
  .route('/:id/edit-requirements')
  .get(form.populateRequirementsFormMiddleware, edit.editRequirementsGet)
  .post(form.populateRequirementsFormMiddleware, form.investmentRequirementsFormPostMiddleware, edit.editRequirementsPost)

router.get('/:id/team', team.getTeamHandler)

router.get('/:id/interactions', interactions.list.indexGetHandler)

router
  .route('/:id/interaction/create')
  .get(form.populateInteractionsFormMiddleware, interactions.create.createGetInteractionHandler)
  .post(
    form.populateInteractionsFormMiddleware,
    form.interactionDetailsFormPostMiddleware,
    interactions.create.createPostInteractionHandler,
    interactions.create.createGetInteractionHandler
  )

router
  .route('/:id/interaction/:interactionId/edit')
  .get(form.populateInteractionsFormMiddleware, interactions.edit.editGetInteractionHandler)
  .post(
    form.populateInteractionsFormMiddleware,
    form.interactionDetailsFormPostMiddleware,
    interactions.edit.editPostInteractionHandler,
    interactions.edit.editGetInteractionHandler
  )

module.exports = router
