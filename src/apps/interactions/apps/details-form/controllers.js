const { get } = require('lodash')
const urls = require('../../../../lib/urls')
const { getActiveEvents } = require('../../../events/repos')
const {
  transformContactToOption,
  transformObjectToOption,
} = require('../../../transformers')
const { getOptions } = require('../../../../lib/options')

const transformServiceToOption = (service) => ({
  value: service.id,
  label: service.name,
  contexts: service.contexts,
  interaction_questions: service.interaction_questions,
})

async function renderInteractionDetailsForm(req, res, next) {
  try {
    const { company, interaction, referral, investment, contact } = res.locals
    const { user } = req.session
    const [
      services,
      serviceDeliveryStatuses,
      communicationChannels,
      countries,
      relatedTradeAgreements,
      exportBarrier,
    ] = await Promise.all([
      getOptions(req, 'service', {
        transformer: transformServiceToOption,
      }),
      getOptions(req, 'service-delivery-status', { sorted: false }),
      getOptions(req, 'communication-channel'),
      getOptions(req, 'country'),
      getOptions(req, 'trade-agreement'),
      getOptions(req, 'export-barrier', { sorted: false }),
    ])

    res
      .breadcrumb([
        {
          text: `${company.name}`,
          href: urls.companies.detail(company.id),
        },
        {
          text: `${interaction ? 'Edit' : 'Add'} interaction`,
        },
      ])
      .render('interactions/apps/details-form/views/interaction-details-form', {
        props: {
          companyId: get(company, 'id'),
          investmentId: get(investment, 'id'),
          referral,
          contactId: get(contact, 'id'),
          contacts: company.contacts
            .filter((contact) => !contact.archived)
            .map(transformContactToOption),
          services,
          serviceDeliveryStatuses,
          communicationChannels,
          subHeading: company.name,
          countries,
          relatedTradeAgreements,
          exportBarrier,
          interactionId: get(interaction, 'id'),
          user,
        },
      })
  } catch (error) {
    next(error)
  }
}

async function fetchActiveEvents(req, res, next) {
  try {
    const activeEvents = await getActiveEvents(req)
    res.json(activeEvents.map(transformObjectToOption))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  fetchActiveEvents,
  renderInteractionDetailsForm,
}
