const { get, includes, snakeCase } = require('lodash')

const { getContactsForCompany } = require('../../contacts/repos')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { getActiveEvents } = require('../../events/repos')
const { transformObjectToOption, transformContactToOption } = require('../../transformers')
const { getOptions } = require('../../../lib/options')
const { SERVICE_DELIVERY_STATUS_COMPLETED } = require('../constants')

async function getInteractionOptions (req, res) {
  const token = req.session.token
  const createdOn = get(res.locals, 'interaction.created_on')
  const companyId = get(res.locals, 'company.id')

  const contacts = await getContactsForCompany(token, companyId)
  const advisers = await getAdvisers(token)
  const currentAdviser = get(res.locals, 'interaction.dit_adviser.id')

  const activeAdvisers = filterActiveAdvisers({
    advisers: advisers.results,
    includeAdviser: currentAdviser,
  })

  const options = {
    advisers: activeAdvisers.map(transformObjectToOption),
    contacts: contacts.filter(contact => !contact.archived).map(transformContactToOption),
    teams: await getOptions(token, 'team', { createdOn }),
    services: await getServiceOptions(req, res, createdOn),
  }

  options.tapServices = options.services
    .filter(service => includes(service.label, '(TAP)'))
    .map(service => service.value)

  options.successfulServiceStatuses = [
    SERVICE_DELIVERY_STATUS_COMPLETED,
  ]

  if (req.params.kind === 'service-delivery') {
    const activeEvents = await getActiveEvents(token, createdOn)
    options.events = activeEvents.map(transformObjectToOption)

    options.statuses = await getOptions(token, 'service-delivery-status', { createdOn, sorted: false })
  } else {
    options.channels = await getOptions(token, 'communication-channel', { createdOn })
  }

  return options
}

async function getServiceOptions (req, res, createdOn) {
  const context = getContextForInteraction(req, res)
  const services = await getOptions(req.session.token, 'service', { createdOn, context })
  return services
}

function getContextForInteraction (req, res) {
  if (get(req, 'params.investmentId') || get(res.locals, 'interaction.investment_project.id')) {
    return 'investment_project_interaction'
  }

  return snakeCase(get(req.params, 'kind', 'interaction'))
}

module.exports = { getInteractionOptions }
