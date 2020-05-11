const { fetchInteraction } = require('../repos')
const { getDitCompany } = require('../../companies/repos')

async function getInteractionDetails(req, res, next, interactionId) {
  try {
    const { token } = req.session

    const interaction = await fetchInteraction(token, interactionId)
    res.locals.interaction = interaction

    if (!res.locals.company) {
      res.locals.company = await getDitCompany(token, interaction.company.id)
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getInteractionDetails,
}
