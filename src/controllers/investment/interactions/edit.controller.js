const router = require('express').Router()

const {
  getInteractionDetails,
  getProjectDetails,
} = require('../shared.middleware')
const {
  populateInteractionsFormMiddleware,
  interactionDetailsFormPostMiddleware,
} = require('../form.middleware')

function getEditInteractionHandler (req, res, next) {
  return res.render('investment/interactions/edit')
}

function postCreateInteractionHandler (req, res, next) {
  if (res.locals.form.errors) {
    return next()
  }
  return res.redirect(`/investment/${res.locals.projectData.id}/interaction/${res.locals.interaction.id}/details`)
}

router.param('id', getProjectDetails)
router.param('interactionId', getInteractionDetails)
router.route('/:id/interaction/:interactionId/edit')
  .get(populateInteractionsFormMiddleware, getEditInteractionHandler)
  .post(populateInteractionsFormMiddleware, interactionDetailsFormPostMiddleware, postCreateInteractionHandler, getEditInteractionHandler)

module.exports = {
  router,
  getEditInteractionHandler,
  postCreateInteractionHandler,
}
