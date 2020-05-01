const { get, set } = require('lodash')
const { sentence } = require('case')

const urls = require('../../../lib/urls')
const { getOptions } = require('../../../lib/options')
const {
  transformInteractionFormBodyToApiRequest,
  transformServicesOptions,
} = require('../transformers')
const { fetchInteraction, saveInteraction } = require('../repos')
const { getDitCompany } = require('../../companies/repos')
const { joinPaths } = require('../../../lib/path')
const { getReturnLink } = require('../helpers')
const canAddCountries = require('../macros/can-add-countries')
const mapErrors = require('../macros/map-errors')

function getFlashMessage(
  kind,
  companyId,
  countriesDiscussed,
  newInteraction,
  existingInteraction
) {
  const flashMessage = `${sentence(kind)} ${
    existingInteraction ? 'updated' : 'created'
  }`

  const countriesDiscussedBody = `You discussed some countries within the interaction, <a href="${urls.companies.exports.index(
    companyId
  )}">click here to view all countries</a> within the export tab`

  // When creating an interaction
  if (newInteraction) {
    const referralAcceptedHeader = 'and referral accepted'
    const referralAcceptedBody = `You can <a href="${urls.dashboard()}">find your referrals on the Homepage</a>`

    if (countriesDiscussed && newInteraction.referralId) {
      return [
        `${flashMessage} ${referralAcceptedHeader}`,
        `${referralAcceptedBody}<br/>${countriesDiscussedBody}`,
      ]
    } else if (countriesDiscussed) {
      return [flashMessage, countriesDiscussedBody]
    } else if (newInteraction.referralId) {
      return [`${flashMessage} ${referralAcceptedHeader}`, referralAcceptedBody]
    } else {
      return [flashMessage]
    }
  }

  // When editing an interaction
  else if (countriesDiscussed) {
    return [flashMessage, countriesDiscussedBody]
  } else {
    return [flashMessage]
  }
}

async function postDetails(req, res, next) {
  try {
    const serviceOptions = await getOptions(req.session.token, 'service', {
      transformer: transformServicesOptions,
      transformWithoutMapping: true,
    })
    res.locals.requestBody = transformInteractionFormBodyToApiRequest(
      req.body,
      serviceOptions,
      canAddCountries(req.params.theme, res.locals.interaction)
    )

    const {
      interaction: existingInteraction,
      interactions: newInteraction,
      requestBody,
      company: { id: companyId },
    } = res.locals

    const result = await saveInteraction(
      req.session.token,
      requestBody,
      (existingInteraction && existingInteraction.company_referral) ||
        (newInteraction && newInteraction.referralId)
    )

    const [header, body] = getFlashMessage(
      req.params.kind,
      companyId,
      result.were_countries_discussed,
      newInteraction,
      existingInteraction
    )

    if (body) {
      req.flashWithBody('success', header, body)
    } else {
      req.flash('success', header)
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
  postDetails,
}
