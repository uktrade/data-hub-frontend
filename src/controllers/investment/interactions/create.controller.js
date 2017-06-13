const router = require('express').Router()

const { getProjectDetails } = require('../shared.middleware')
const {
  populateInteractionsFormMiddleware,
  interactionDetailsFormPostMiddleware,
} = require('../form.middleware')

function getAddInteractionHandler (req, res, next) {
  return res.render('investment/interactions/create')
}

function postAddInteractionHandler (req, res, next) {
  if (res.locals.form.errors) {
    return next()
  }

  req.flash('success-message', 'Investment Interaction successfully created')
  return res.redirect(`/investment/${res.locals.projectData.id}/interactions`)
}

router.param('id', getProjectDetails)

router
  .route('/:id/interaction/create')
  .get(populateInteractionsFormMiddleware, getAddInteractionHandler)
  .post(
    populateInteractionsFormMiddleware,
    interactionDetailsFormPostMiddleware,
    postAddInteractionHandler,
    getAddInteractionHandler
  )

module.exports = {
  router,
  getAddInteractionHandler,
  postAddInteractionHandler,
}
