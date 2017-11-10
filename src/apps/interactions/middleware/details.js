const { assign } = require('lodash')
const { sentence } = require('case')

const { transformInteractionFormBodyToApiRequest } = require('../transformers')
const { fetchInteraction, saveInteraction } = require('../repos')
const metaDataRepository = require('../../../lib/metadata')
const { getContactsForCompany } = require('../../contacts/repos')
const { getAdvisers } = require('../../adviser/repos')
const { search } = require('../../search/services')

async function postDetails (req, res, next) {
  res.locals.requestBody = transformInteractionFormBodyToApiRequest(req.body)

  try {
    const result = await saveInteraction(req.session.token, res.locals.requestBody)

    req.flash('success', `${sentence(req.params.kind)} ${res.locals.interaction ? 'updated' : 'created'}`)

    if (res.locals.returnLink) {
      return res.redirect(res.locals.returnLink + result.id)
    }

    return res.redirect(`/interactions/${result.id}`)
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = assign({}, res.locals.form, {
        errors: {
          messages: err.error,
        },
      })
      next()
    } else {
      next(err)
    }
  }
}

async function getInteractionDetails (req, res, next, interactionId) {
  try {
    res.locals.interaction = await fetchInteraction(req.session.token, interactionId)
    res.locals.company = res.locals.interaction.company
    next()
  } catch (err) {
    next(err)
  }
}

async function getInteractionOptions (req, res, next) {
  try {
    res.locals.advisers = await getAdvisers(req.session.token)
    res.locals.contacts = await getContactsForCompany(req.session.token, res.locals.company.id)
    res.locals.services = await metaDataRepository.getServices(req.session.token)

    if (req.params.kind === 'service-delivery') {
      res.locals.events = await search({
        searchEntity: 'event',
        requestBody: { sortby: 'name:asc' },
        token: req.session.token,
        limit: 100000,
        isAggregation: false,
      })
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getInteractionDetails,
  postDetails,
  getInteractionOptions,
}
