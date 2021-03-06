const { lowerCase, capitalize } = require('lodash')

const { transformInteractionResponseToViewRecord } = require('../transformers')
const { INTERACTION_STATUS } = require('../constants')

function renderDetailsPage(req, res, next) {
  try {
    const { interaction } = res.locals
    const breadcrumb = capitalize(lowerCase(interaction.kind))
    const isComplete = interaction.status === INTERACTION_STATUS.COMPLETE
    const interactionViewRecord = transformInteractionResponseToViewRecord(
      interaction,
      isComplete
    )
    const referral = interaction.company_referral
    if (referral) {
      referral.companyId = interaction.company.id
    }
    const canComplete =
      interaction.status === INTERACTION_STATUS.DRAFT &&
      new Date(interaction.date) < new Date() &&
      !interaction.archived

    return res
      .breadcrumb(breadcrumb)
      .title(interaction.subject)
      .render('interactions/views/details', {
        interactionViewRecord,
        canComplete,
        canEdit: isComplete,
        referral,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
