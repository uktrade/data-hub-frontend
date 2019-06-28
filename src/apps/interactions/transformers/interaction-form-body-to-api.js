const { omit } = require('lodash')

const castCompactArray = require('../../../lib/cast-compact-array')
const { transformDateObjectToDateString } = require('../../transformers')
const { INTERACTION_STATUS } = require('../constants')

function transformInteractionFormBodyToApiRequest (props, services) {
  const policyAreasArray = castCompactArray(props.policy_areas)
  const policyIssueTypesArray = castCompactArray(props.policy_issue_types)
  const contactTypesArray = castCompactArray(props.contacts)
  const advisersArray = castCompactArray(props.dit_participants).map(
    adviser => ({ adviser: adviser })
  )
  const selectedServiceOption = services.filter(
    service => service.value === props.service
  )

  const serviceAnswers = {}

  const service = selectedServiceOption.map(option => {
    if (option.secondaryOptions.length) {
      return props.subService
    } else {
      return option.value
    }
  })

  selectedServiceOption.map(question => {
    return question.secondaryOptions.length ? question.secondaryOptions.map(secondaryOption => {
      return secondaryOption.interactionQuestions.map((interactionQuestion) => {
        const selectedQuestionKey = interactionQuestion.value
        for (const [key, value] of Object.entries(props)) {
          if (key === selectedQuestionKey) {
            serviceAnswers[key] = {
              [value]: {},
            }
          }
        }
      })
    }) : question.interactionQuestions.map((interactionQuestion) => {
      const selectedQuestionKey = interactionQuestion.value
      for (const [key, value] of Object.entries(props)) {
        if (key === selectedQuestionKey) {
          serviceAnswers[key] = {
            [value]: {},
          }
        }
      }
    })
  })
  return omit({
    ...props,
    service: service[0],
    service_answers: serviceAnswers,
    date: transformDateObjectToDateString('date')(props),
    grant_amount_offered: props.grant_amount_offered || null,
    net_company_receipt: props.net_company_receipt || null,
    contacts: contactTypesArray,
    dit_participants: advisersArray,
    policy_areas: policyAreasArray,
    policy_issue_types: policyIssueTypesArray,
    status: INTERACTION_STATUS.COMPLETE,
  }, ['date_day', 'date_month', 'date_year'])
}

module.exports = transformInteractionFormBodyToApiRequest
