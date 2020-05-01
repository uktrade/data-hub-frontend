const { get } = require('lodash')
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

async function renderAddInteractionForm(req, res, next) {
  try {
    const { user, token } = req.session
    const { company, referral } = res.locals
    const { theme, kind } = req.params

    const [
      services,
      serviceDeliveryStatuses,
      policyAreas,
      policyIssueTypes,
      communicationChannels,
      countries,
      activeEvents,
      ,
    ] = await Promise.all([
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
          defaultValues: {
            theme,
            kind,
            advisers: [
              {
                label: `${user.name}${
                  user.dit_team ? ', ' + user.dit_team.name : ''
                }`,
                value: user.id,
              },
            ],
          },
          companyId: company.id,
          referral,
          contacts: company.contacts.map(transformContactToOption),
          activeEvents: activeEvents.map(transformObjectToOption),
          returnLink: get(res.locals, 'interactions.returnLink'),
          services,
          serviceDeliveryStatuses,
          policyAreas,
          policyIssueTypes,
          communicationChannels,
          countries,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAddInteractionForm,
}
