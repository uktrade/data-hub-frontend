const { getActiveEvents } = require('../../../events/repos')
const {
  transformContactToOption,
  transformObjectToOption,
} = require('../../../transformers')
const { getDitCompany } = require('../../../companies/repos')
const { getOptions } = require('../../../../lib/options')

const transformServiceToOption = (service) => ({
  value: service.id,
  label: service.name,
  contexts: service.contexts,
  interaction_questions: service.interaction_questions,
})

async function renderAddInteractionForm(req, res, next) {
  try {
    const { user, token } = req.session
    const { company: companyId } = req.query

    const [
      companyDetails,
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
      .breadcrumb(`Add interaction for ${companyDetails.name}`)
      .render('interactions/apps/add-interaction/views/add-interaction-form', {
        props: {
          companyId: companyDetails.id,
          defaultAdviser: {
            label: `${user.name}${
              user.dit_team ? ', ' + user.dit_team.name : ''
            }`,
            value: user.id,
          },
          contacts: companyDetails.contacts.map(transformContactToOption),
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
  renderAddInteractionForm,
}
