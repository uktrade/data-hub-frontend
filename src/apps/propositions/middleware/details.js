const { assign, get, filter, includes, map } = require('lodash')
const { sentence } = require('case')

const { transformPropositionFormBodyToApiRequest } = require('../transformers')
const { fetchProposition, saveProposition } = require('../repos')
const { getContactsForCompany, getContact } = require('../../contacts/repos')
const { getInvestment } = require('../../investment-projects/repos')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { getActiveEvents } = require('../../events/repos')
const { getDitCompany } = require('../../companies/repos')
const { transformObjectToOption, transformContactToOption } = require('../../transformers')
const { getOptions } = require('../../../lib/options')

const SERVICE_DELIVERY_STATUS_COMPLETED = '47329c18-6095-e211-a939-e4115bead28a'

async function postDetails (req, res, next) {
  res.locals.requestBody = transformPropositionFormBodyToApiRequest(req.body)

  try {
    const result = await saveProposition(req.session.token, res.locals.requestBody)

    req.flash('success', `${sentence(req.params.kind)} ${res.locals.proposition ? 'updated' : 'created'}`)

    if (res.locals.returnLink) {
      return res.redirect(res.locals.returnLink + result.id)
    }

    return res.redirect(`/propositions/${result.id}`)
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

async function getPropositionDetails (req, res, next, propositionId) {
  try {
    const token = req.session.token
    const investmentId = get(res.locals, 'investmentData.id')
    // console.log('============== getPropositionDetails ================ ', investmentId)
    // const investment_project = contact = await getInvestment(token, investmentId)
    const proposition = res.locals.proposition = await fetchProposition(token, propositionId, investmentId)

    // Get the company associated with the proposition. This can be in the proposition
    // record, or in the case of editing investment propositions it is the company
    // associated with the proposition contact.
    // if (proposition.company) {
    //   res.locals.company = proposition.company
    //   return next()
    // }

    // const contactId = get(proposition, 'contact.id')
    // if (!contactId) {
    //   return next(new Error('An proposition must have a company or contact associated with it'))
    // }
    //
    // const contact = await getContact(token, contactId)
    // res.locals.company = await getDitCompany(token, contact.company.id)

    next()
  } catch (err) {
    next(err)
  }
}

async function getPropositionOptions (req, res, next) {

  console.log('>>>>>>>>>>>>>> getPropositionOptions <<<<<<<<<<<<<<<<<')

  try {
    const token = req.session.token
    const createdOn = get(res.locals, 'proposition.created_on')

    const companyId = get(res.locals, 'company.id')
    const contacts = await getContactsForCompany(token, companyId)

    const advisers = await getAdvisers(token)
    const currentAdviser = get(res.locals, 'proposition.adviser.id')
    const activeAdvisers = filterActiveAdvisers({
      advisers: advisers.results,
      includeAdviser: currentAdviser,
    })

    const services = await getOptions(token, 'service', { createdOn })
    res.locals.options = {
      services,
      advisers: activeAdvisers.map(transformObjectToOption),
      contacts: filter(contacts, contact => !contact.archived).map(transformContactToOption),
      statuses: await getOptions(token, 'service-delivery-status', { createdOn, sorted: false }),
      teams: await getOptions(token, 'team', { createdOn }),
      channels: await getOptions(token, 'communication-channel', { createdOn }),
    }

    const tapServices = map(filter(services, (service) => {
      return includes(service.label, '(TAP)')
    }), (tapService) => {
      return tapService.value
    })
    const successfulServiceStatuses = [
      SERVICE_DELIVERY_STATUS_COMPLETED,
    ]
    res.locals.conditions = {
      tapServices,
      successfulServiceStatuses,
    }

    if (req.params.kind === 'service-delivery') {
      const activeEvents = await getActiveEvents(token, createdOn)
      res.locals.options.events = activeEvents.map(transformObjectToOption)
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getPropositionDetails,
  postDetails,
  getPropositionOptions,
}
