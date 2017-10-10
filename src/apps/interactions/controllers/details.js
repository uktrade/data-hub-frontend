const {
  lowerCase,
  capitalize,
} = require('lodash')

const { transformInteractionResponseToViewRecord } = require('../transformers')

function renderDetailsPage (req, res, next) {
  try {
    const { interaction } = res.locals
    const breadcrumb = capitalize(lowerCase(interaction.kind))
    const interactionViewRecord = transformInteractionResponseToViewRecord(interaction)

    return res
      .breadcrumb(breadcrumb)
      .render('interactions/views/details', {
        interactionViewRecord,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
