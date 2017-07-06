const { isEmpty } = require('lodash')

function editGetInteractionHandler (req, res, next) {
  res.locals.title.unshift('Edit interaction')

  res.render('investment-projects/views/interactions/edit')
}

function editPostInteractionHandler (req, res, next) {
  if (!isEmpty(res.locals.form.errors)) {
    return next()
  }

  req.flash('success', 'Investment Interaction successfully updated')
  return res.redirect(`/investment-projects/${res.locals.investmentData.id}/interactions`)
}

module.exports = {
  editGetInteractionHandler,
  editPostInteractionHandler,
}
