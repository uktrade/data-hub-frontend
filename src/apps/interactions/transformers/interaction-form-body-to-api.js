const { castArray, compact, omit } = require('lodash')

const { transformDateObjectToDateString } = require('../../transformers')

function transformInteractionFormBodyToApiRequest (props) {
  const policyAreasArray = compact(castArray(props.policy_areas))

  return omit({
    ...props,
    date: transformDateObjectToDateString('date')(props),
    grant_amount_offered: props.grant_amount_offered || null,
    net_company_receipt: props.net_company_receipt || null,
    policy_areas: policyAreasArray,
  }, ['date_day', 'date_month', 'date_year'])
}

module.exports = transformInteractionFormBodyToApiRequest
