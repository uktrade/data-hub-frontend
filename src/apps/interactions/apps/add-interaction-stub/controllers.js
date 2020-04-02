const { getActiveEvents } = require('../../../events/repos')
const {
  transformContactToOption,
  transformObjectToOption,
} = require('../../../transformers')
const { getDitCompany } = require('../../../companies/repos')
const { getAdvisers } = require('../../../adviser/repos')
const { getOptions } = require('../../../../lib/options')

const transformServiceToOption = (service) => ({
  value: service.id,
  label: service.name,
  contexts: service.contexts,
  interaction_questions: service.interaction_questions,
})

async function renderAddInteractionStubForm(req, res, next) {
  throw new Error("OOOF");
  try {
    const { user, token } = req.session
    const { company_id: companyId } = req.query

    const [
      company,
      { results: advisers },
      services,
      serviceDeliveryStatuses,
      policyAreas,
      policyIssueTypes,
      communicationChannels,
      countries,
      activeEvents,
      ,
    ] = await Promise.all([
      getDitCompany(req.session.token, companyId),
      getAdvisers(token),
      getOptions(token, 'service', {
        transformer: transformServiceToOption,
      }),
      getOptions(token, 'service-delivery-status', { sorted: false }),
      getOptions(token, 'policy-area'),
      getOptions(token, 'policy-issue-type'),
      getOptions(token, 'communication-channel'),
      getOptions(token, 'country', {
        transformer: transformServiceToOption,
      }),
      getActiveEvents(token),
    ])

    res
      .breadcrumb(`Add interaction for ${company.name}`)
      .render('interactions/apps/add-interaction/views/add-interaction-form', {
        props: {
          company,
          advisers: advisers
            .filter((adviser) => !adviser.archived)
            .map(transformObjectToOption),
          defaultAdviser: { label: user.name, value: user.id },
          contacts: company.contacts.map(transformContactToOption),
          services,
          serviceDeliveryStatuses,
          policyAreas,
          policyIssueTypes,
          communicationChannels,
          countries,
          activeEvents: activeEvents.map(transformObjectToOption),
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAddInteractionStubForm,
}
