const { omit } = require('lodash')

const castCompactArray = require('../../../lib/cast-compact-array')
const { transformDateObjectToDateString } = require('../../transformers')
const getExportCountries = require('../macros/get-export-countries')

const { INTERACTION_STATUS } = require('../constants')

const fieldsToOmit = ['date_day', 'date_month', 'date_year']

function transformInteractionFormBodyToApiRequest (body, services, addCountries) {
  let service = null
  const serviceAnswers = {}

  const selectedServiceOption = services.find(
    service => service.value === body.service
  )

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

  const fields = {
    ...body,
    service,
    service_answers: serviceAnswers,
    date: transformDateObjectToDateString('date')(body),
    grant_amount_offered: body.grant_amount_offered || null,
    net_company_receipt: body.net_company_receipt || null,
    contacts: castCompactArray(body.contacts),
    dit_participants: castCompactArray(body.dit_participants).map(adviser => ({ adviser })),
    policy_areas: castCompactArray(body.policy_areas),
    policy_issue_types: castCompactArray(body.policy_issue_types),
    status: INTERACTION_STATUS.COMPLETE,
    were_countries_discussed: body.were_countries_discussed || null,
  }

  if (addCountries && body.were_countries_discussed === 'true') {
    fields.export_countries = getExportCountries(body)
  }

  return omit(
    fields,
    fieldsToOmit
  )
}

module.exports = transformInteractionFormBodyToApiRequest
