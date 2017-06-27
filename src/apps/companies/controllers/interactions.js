const { getInflatedDitCompany, getCommonTitlesAndlinks } = require('../services/data')
const { getDisplayCompanyInteraction } = require('../../interactions/services/formatting')

/**
 *
 *  HTTP Get call to get a list of interactions for a company
 *  Gets a list of interactions associated with a company
 *  Furthermore the controller extracts only the fields required and pre-formats them to make layout easier.
 */
async function getInteractions (req, res, next) {
  try {
    res.locals.tab = 'interactions'
    const company = res.locals.company = await getInflatedDitCompany(req.session.token, req.params.id)
    getCommonTitlesAndlinks(req, res, company)

    res.locals.interactions = res.locals.company.interactions.map(interaction => getDisplayCompanyInteraction(interaction))

    // Only allow a link to add an interaction if the company has contacts
    if (company.id && company.contacts && company.contacts.length > 0) {
      res.locals.addInteractionUrl = `/interaction/add-step-1/?company=${company.id}`
    }

    if (!company.contacts || company.contacts.length === 0) {
      res.locals.addContact = `/contacts/create?company=${res.locals.company.id}`
    }

    res.locals.title = ['Interactions', res.locals.company.name, 'Companies']

    res.render('companies/views/interactions')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInteractions,
}
