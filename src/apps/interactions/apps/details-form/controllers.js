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
    const {
      company,
      interaction,
      referral,
      investment,
      contact,
      companyExport,
    } = res.locals
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

    const exportLinkText = companyExport
      ? `${companyExport.title} to ${companyExport.destination_country.name}`
      : 'Not set'
    const companyLinkText = company.name
    const companyLinkHref = urls.companies.detail(company.id)

    let breadcrumb = []
    if (companyExport) {
      breadcrumb.push(
        {
          text: exportLinkText,
          href: urls.exportPipeline.details(companyExport.id),
        },
        {
          text: `Interactions`,
          href: urls.exportPipeline.interactions.index(companyExport.id),
        }
      )
    } else {
      breadcrumb.push({
        text: `${company.name}`,
        href: urls.companies.detail(company.id),
      })
    }

    res
      .breadcrumb([
        ...breadcrumb,
        {
          text: `${interaction ? 'Edit' : 'Add'} interaction`,
        },
      ])
      .render('interactions/apps/details-form/views/interaction-details-form', {
        props: {
          companyId: get(company, 'id'),
          investmentId: get(investment, 'id'),
          companyExportId: get(companyExport, 'id'),
          referral,
          contactId: get(contact, 'id'),
          contacts: company.contacts
            .filter((contact) => !contact.archived)
            .map(transformContactToOption),
          services,
          serviceDeliveryStatuses,
          communicationChannels,
          heading: exportLinkText,
          preHeading: `<a href="${companyLinkHref}">${companyLinkText}</a>`,
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
