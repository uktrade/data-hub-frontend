const {
  lowerCase,
  capitalize,
} = require('lodash')

const { transformInteractionResponseToViewRecord } = require('../transformers')
const { INTERACTION_STATUS } = require('../constants')
const { NEW_COUNTRIES_FEATURE } = require('../../constants')

function renderDetailsPage (req, res, next) {
  try {
    const { interaction, features } = res.locals
    const breadcrumb = capitalize(lowerCase(interaction.kind))
    const isComplete = interaction.status === INTERACTION_STATUS.COMPLETE
    const useNewCountries = features[ NEW_COUNTRIES_FEATURE ]
    const interactionViewRecord = transformInteractionResponseToViewRecord(interaction, isComplete, useNewCountries)
    const canComplete = interaction.status === INTERACTION_STATUS.DRAFT &&
      new Date(interaction.date) < new Date() &&
      !interaction.archived

    return res
      .breadcrumb(breadcrumb)
      .title(interaction.subject)
      .render('interactions/views/details', {
        interactionViewRecord,
        canComplete,
        canEdit: isComplete,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
