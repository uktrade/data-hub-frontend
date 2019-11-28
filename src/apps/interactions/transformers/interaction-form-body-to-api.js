const { omit } = require('lodash')

const castCompactArray = require('../../../lib/cast-compact-array')
const { transformDateObjectToDateString } = require('../../transformers')
const { INTERACTION_STATUS } = require('../constants')

function transformInteractionFormBodyToApiRequest (body, services) {
  const policyAreasArray = castCompactArray(body.policy_areas)
  const policyIssueTypesArray = castCompactArray(body.policy_issue_types)
  const contactTypesArray = castCompactArray(body.contacts)
  const advisersArray = castCompactArray(body.dit_participants).map(
    adviser => ({ adviser: adviser })
  )
  const selectedServiceOption = services.find(
    service => service.value === body.service
  )

  const serviceAnswers = {}
  let service = null
  if (selectedServiceOption) {
    const serviceHasSecondaryOptions = !!selectedServiceOption.secondaryOptions.length

    service = serviceHasSecondaryOptions
      ? body.subService.find(id => id.length)
      : selectedServiceOption.value

    const serviceOptionStore = serviceHasSecondaryOptions
      ? selectedServiceOption.secondaryOptions[0]
      : selectedServiceOption

    serviceOptionStore.interactionQuestions.map(interactionQuestion => {
      for (const [key, value] of Object.entries(body)) {
        if (key === interactionQuestion.value) {
          serviceAnswers[key] = {
            [value]: {},
          }
        }
      }
    })
  }

  return omit(
    {
      ...body,
      service,
      service_answers: serviceAnswers,
      date: transformDateObjectToDateString('date')(body),
      grant_amount_offered: body.grant_amount_offered || null,
      net_company_receipt: body.net_company_receipt || null,
      contacts: contactTypesArray,
      dit_participants: advisersArray,
      policy_areas: policyAreasArray,
      policy_issue_types: policyIssueTypesArray,
      status: INTERACTION_STATUS.COMPLETE,
    },
    ['date_day', 'date_month', 'date_year']
  )
}

module.exports = transformInteractionFormBodyToApiRequest
