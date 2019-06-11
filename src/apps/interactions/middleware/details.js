const { get, set } = require('lodash')
const { sentence } = require('case')

const { transformInteractionFormBodyToApiRequest } = require('../transformers')
const { fetchInteraction, saveInteraction } = require('../repos')
const { getContact } = require('../../contacts/repos')
const { getDitCompany } = require('../../companies/repos')
const { joinPaths } = require('../../../lib/path')
const { getReturnLink } = require('../helpers')

async function postDetails (req, res, next) {
  res.locals.requestBody = transformInteractionFormBodyToApiRequest(req.body)

  try {
    const result = await saveInteraction(req.session.token, res.locals.requestBody)

    req.flash('success', `${sentence(req.params.kind)} ${res.locals.interaction ? 'updated' : 'created'}`)
    res.redirect(joinPaths([ getReturnLink(res.locals.interactions), result.id ]))
  } catch (err) {
    if (err.statusCode !== 400) {
      return next(err)
    }

    set(res.locals, 'form.errors.messages', err.error)
    next()
  }
}

async function getInteractionDetails (req, res, next, interactionId) {
  try {
    const token = req.session.token
    const interaction = res.locals.interaction = await fetchInteraction(token, interactionId)

    // Get the company associated with the interaction. This can be in the interaction
    // record, or in the case of editing investment interactions it is the company
    // associated with the interaction contact.
    if (interaction.company) {
      res.locals.company = interaction.company
      return next()
    }

    const contactId = get(interaction, 'contact.id')
    if (!contactId) {
      return next(new Error('An interaction must have a company or contact associated with it'))
    }

    const contact = await getContact(token, contactId)
    res.locals.company = await getDitCompany(token, contact.company.id)

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getInteractionDetails,
  postDetails,
}
