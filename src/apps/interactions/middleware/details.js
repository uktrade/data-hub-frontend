const { get, set } = require('lodash')
const { sentence } = require('case')

const urls = require('../../../lib/urls')
const { getOptions } = require('../../../lib/options')
const {
  transformInteractionFormBodyToApiRequest,
  transformServicesOptions,
} = require('../transformers')
const { fetchInteraction, saveInteraction } = require('../repos')
const { getContact } = require('../../contacts/repos')
const { getDitCompany } = require('../../companies/repos')
const { joinPaths } = require('../../../lib/path')
const { getReturnLink } = require('../helpers')
const canAddCountries = require('../macros/can-add-countries')
const mapErrors = require('../macros/map-errors')

async function postDetails(req, res, next) {
  try {
    const companyId = res.locals.company.id
    const serviceOptions = await getOptions(req.session.token, 'service', {
      transformer: transformServicesOptions,
      transformWithoutMapping: true,
    })
    res.locals.requestBody = transformInteractionFormBodyToApiRequest(
      req.body,
      serviceOptions,
      canAddCountries(req.params.theme, res.locals.interaction)
    )

    const result = await saveInteraction(
      req.session.token,
      res.locals.requestBody,
      (res.locals.interaction && res.locals.interaction.company_referral) ||
        (res.locals.interactions && res.locals.interactions.referralId) ||
        undefined
    )

    const flashMessage = `${sentence(req.params.kind)} ${
      res.locals.interaction ? 'updated' : 'created'
    }`

    const referralAcceptedMessageHeader = 'and referral accepted'

    const referralAcceptedMessageBody = `You can <a href="${urls.dashboard()}">find your referrals on the Homepage</a>`

    const countriesDiscussedMessage = `You discussed some countries within the interaction, <a href="${urls.companies.exports.index(
      companyId
    )}">click here to view all countries</a> within the export tab`

    // When creating a referral
    if (res.locals.interactions) {
      if (
        result.were_countries_discussed &&
        res.locals.interactions.referralId
      ) {
        req.flashWithBody(
          'success',
          `${flashMessage} ${referralAcceptedMessageHeader}`,
          `${referralAcceptedMessageBody}<br/>${countriesDiscussedMessage}`
        )
      } else if (result.were_countries_discussed) {
        req.flashWithBody('success', flashMessage, countriesDiscussedMessage)
      } else if (res.locals.interactions.referralId) {
        req.flashWithBody(
          'success',
          `${flashMessage} ${referralAcceptedMessageHeader}`,
          referralAcceptedMessageBody
        )
      } else {
        req.flash('success', flashMessage)
      }
    }
    // When editing a referral
    else if (result.were_countries_discussed) {
      req.flashWithBody('success', flashMessage, countriesDiscussedMessage)
    } else {
      req.flash('success', flashMessage)
    }

    res.redirect(joinPaths([getReturnLink(res.locals.interactions), result.id]))
  } catch (err) {
    if (err.statusCode !== 400) {
      return next(err)
    }

    const nonFieldErrors = get(err.error, 'non_field_errors')

    if (nonFieldErrors) {
      set(res.locals, 'form.errors.nonField', nonFieldErrors)
    }

    set(res.locals, 'form.errors.messages', mapErrors(err.error))
    next()
  }
}

async function getInteractionDetails(req, res, next, interactionId) {
  try {
    const token = req.session.token
    const interaction = (res.locals.interaction = await fetchInteraction(
      token,
      interactionId
    ))

    // Get the company associated with the interaction. This can be in the interaction
    // record, or in the case of editing investment interactions it is the company
    // associated with the interaction contact.
    if (interaction.company) {
      res.locals.company = interaction.company
      return next()
    }

    const contactId = get(interaction, 'contact.id')
    if (!contactId) {
      return next(
        new Error(
          'An interaction must have a company or contact associated with it'
        )
      )
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
