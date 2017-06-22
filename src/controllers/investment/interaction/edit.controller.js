const { isEmpty } = require('lodash')
const router = require('express').Router()

const {
  getInteractionDetails,
  getProjectDetails,
} = require('../shared.middleware')
const {
  populateInteractionsFormMiddleware,
  interactionDetailsFormPostMiddleware,
} = require('../form.middleware')

function editGetInteractionHandler (req, res, next) {
  res.locals.title.unshift('Edit interaction')

  res.render('investment/interaction/edit')
}

function editPostInteractionHandler (req, res, next) {
  if (!isEmpty(res.locals.form.errors)) {
    return next()
  }

  req.flash('success-message', 'Investment Interaction successfully updated')
  return res.redirect(`/investment/${res.locals.projectData.id}/interactions`)
}

router.param('id', getProjectDetails)
router.param('interactionId', getInteractionDetails)

router
  .route('/:id/interaction/:interactionId/edit')
  .get(populateInteractionsFormMiddleware, editGetInteractionHandler)
  .post(
    populateInteractionsFormMiddleware,
    interactionDetailsFormPostMiddleware,
    editPostInteractionHandler,
    editGetInteractionHandler
  )

module.exports = {
  router,
  editGetInteractionHandler,
  editPostInteractionHandler,
}
