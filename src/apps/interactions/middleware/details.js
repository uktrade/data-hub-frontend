const { fetchInteraction } = require('../repos')
const { getDitCompany } = require('../../companies/repos')

async function getInteractionDetails(req, res, next, interactionId) {
  try {
    const interaction = await fetchInteraction(req, interactionId)
    res.locals.interaction = interaction

    if (!res.locals.company) {
      const companies = await Promise.all(
        interaction.companies.map((company) => getDitCompany(req, company.id))
      )
      res.locals.company = companies[0]
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getInteractionDetails,
}
