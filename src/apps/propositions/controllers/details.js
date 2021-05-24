const { lowerCase, capitalize } = require('lodash')

const { transformPropositionResponseToViewRecord } = require('../transformers')

function renderDetailsPage(req, res, next) {
  try {
    const { proposition } = res.locals
    const breadcrumb = capitalize(lowerCase(proposition.name))
    const propositionViewRecord =
      transformPropositionResponseToViewRecord(proposition)
    return res
      .breadcrumb(breadcrumb)
      .title(proposition.name)
      .render('propositions/views/details', {
        propositionViewRecord,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
