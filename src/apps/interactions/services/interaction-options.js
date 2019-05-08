const { get, includes } = require('lodash')

const { getContactsForCompany } = require('../../contacts/repos')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { getActiveEvents } = require('../../events/repos')
const { transformObjectToOption, transformContactToOption } = require('../../transformers')
const { transformAdviserToOption } = require('../../adviser/transformers')
const { getOptions } = require('../../../lib/options')
const { SERVICE_DELIVERY_STATUS_COMPLETED } = require('../constants')

async function getInteractionOptions (req, res) {
  const token = req.session.token
  const kind = req.params.kind
  const createdOn = get(res.locals, 'interaction.created_on')

  const commonOptions = await getCommonOptions(token, createdOn, req, res)

  let formOptions

  if (kind === 'service-delivery') {
    formOptions = await getServiceDeliveryFormOptions(token, createdOn, req, res)
  } else {
    formOptions = await getInteractionFormOptions(token, createdOn, req, res)
  }

  return {
    ...commonOptions,
    ...formOptions,
  }
}

async function getCommonOptions (token, createdOn, req, res) {
  const companyId = get(res.locals, 'company.id')
  const currentAdviser = get(res.locals, 'interaction.dit_adviser.id')

  const contacts = await getContactsForCompany(token, companyId)
  const advisers = await getAdvisers(token)

  const activeAdvisers = filterActiveAdvisers({
    advisers: advisers.results,
    includeAdviser: currentAdviser,
  })

  const commonOptions = {
    advisers: activeAdvisers.map(transformAdviserToOption),
    contacts: contacts.filter(contact => !contact.archived).map(transformContactToOption),
    teams: await getOptions(token, 'team', { createdOn }),
  }

  return commonOptions
}

async function getInteractionFormOptions (token, createdOn, req, res) {
  const formOptions = {
    areas: await getOptions(token, 'policy-area', { createdOn }),
    services: await getServiceOptions(req, res, createdOn),
    types: await getOptions(token, 'policy-issue-type', { createdOn }),
    channels: await getOptions(token, 'communication-channel', { createdOn }),
  }

  return formOptions
}

async function getServiceDeliveryFormOptions (token, createdOn, req, res) {
  const services = await getServiceOptions(req, res, createdOn)
  const activeEvents = await getActiveEvents(token, createdOn)

  const formOptions = {
    areas: await getOptions(token, 'policy-area', { createdOn }),
    types: await getOptions(token, 'policy-issue-type', { createdOn }),
    channels: await getOptions(token, 'communication-channel', { createdOn }),
    events: activeEvents.map(transformObjectToOption),
    tapServices: services
      .filter(service => includes(service.label, '(TAP)'))
      .map(service => service.value),
    services: services,
    statuses: await getOptions(token, 'service-delivery-status', { createdOn, sorted: false }),
    successfulServiceStatuses: [SERVICE_DELIVERY_STATUS_COMPLETED],
  }

  return formOptions
}

async function getServiceOptions (req, res, createdOn) {
  const context = getContextForInteraction(req, res)
  const services = await getOptions(req.session.token, 'service', { createdOn, context })
  return services
}

function getContextForInteraction (req, res) {
  const { theme = {}, kind } = req.params

  if (get(res, 'locals.investment.id') || get(res.locals, 'interaction.investment_project.id')) {
    return 'investment_project_interaction'
  }

  const getContext = {
    'export': (kind) => kind === 'interaction' ? 'export_interaction' : 'export_service_delivery',
    'other': (kind) => kind === 'interaction' ? 'other_interaction' : 'other_service_delivery',
  }
  return getContext[theme] ? getContext[theme](kind) : 'investment_interaction'
}

module.exports = { getInteractionOptions }
