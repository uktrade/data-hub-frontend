const { isEmpty } = require('lodash')

function createGetInteractionHandler (req, res, next) {
  res.locals.title.unshift('Add interaction')

  return res.render('investment-projects/views/interactions/create')
}

function createPostInteractionHandler (req, res, next) {
  if (!isEmpty(res.locals.form.errors)) {
    return next()
  }

  req.flash('success-message', 'Investment Interaction successfully created')
  return res.redirect(`/investment/${res.locals.projectData.id}/interactions`)
}

module.exports = {
  createGetInteractionHandler,
  createPostInteractionHandler,
}
