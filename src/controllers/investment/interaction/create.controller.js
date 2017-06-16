const { isEmpty } = require('lodash')
const router = require('express').Router()

const { getProjectDetails } = require('../shared.middleware')
const {
  populateInteractionsFormMiddleware,
  interactionDetailsFormPostMiddleware,
} = require('../form.middleware')

function createGetInteractionHandler (req, res, next) {
  res.locals.title.unshift('Add interaction')

  return res.render('investment/interaction/create')
}

function createPostInteractionHandler (req, res, next) {
  if (!isEmpty(res.locals.form.errors)) {
    return next()
  }

  req.flash('success-message', 'Investment Interaction successfully created')
  return res.redirect(`/investment/${res.locals.projectData.id}/interactions`)
}

router.param('id', getProjectDetails)

router
  .route('/:id/interaction/create')
  .get(populateInteractionsFormMiddleware, createGetInteractionHandler)
  .post(
    populateInteractionsFormMiddleware,
    interactionDetailsFormPostMiddleware,
    createPostInteractionHandler,
    createGetInteractionHandler
  )

module.exports = {
  router,
  createGetInteractionHandler,
  createPostInteractionHandler,
}
