const {
  lowerCase,
  capitalize,
} = require('lodash')

const { transformPropositionResponseToViewRecord } = require('../transformers')

function renderDetailsPage (req, res, next) {

  console.log('???????? is it here ????????')
  try {
    const { proposition } = res.locals
    const breadcrumb = capitalize(lowerCase(proposition.kind))
    const propositionViewRecord = transformPropositionResponseToViewRecord(proposition)

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
