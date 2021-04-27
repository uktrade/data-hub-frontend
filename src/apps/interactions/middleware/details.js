const { fetchInteraction } = require('../repos')
const { getDitCompany } = require('../../companies/repos')

async function getInteractionDetails(req, res, next, interactionId) {
  try {
    const interaction = await fetchInteraction(
      req,
      interactionId,
      res.locals.features['trade-agreement-interaction-v4-endpoint']
    )
    res.locals.interaction = interaction

    if (!res.locals.company) {
      res.locals.company = await getDitCompany(req, interaction.company.id)
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getInteractionDetails,
}
