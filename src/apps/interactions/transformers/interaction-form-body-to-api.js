const { omit } = require('lodash')

const { transformDateObjectToDateString } = require('../../transformers')

function transformInteractionFormBodyToApiRequest (props) {
  return omit({
    ...props,
    date: transformDateObjectToDateString('date')(props),
    grant_amount_offered: props.grant_amount_offered || null,
    net_company_receipt: props.net_company_receipt || null,
  }, ['date_day', 'date_month', 'date_year'])
}

module.exports = transformInteractionFormBodyToApiRequest
