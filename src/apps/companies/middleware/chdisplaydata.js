const { getDisplayCH } = require('../services/formatting')
const chDetailsDisplayOrder = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']
const { chDetailsLabels } = require('../labels')

function chDisplayData (req, res, next) {
  if (res.locals.company && res.locals.company.companies_house_data) {
    res.local = Object.assign({}, res.locals, {
      chDetails: getDisplayCH(res.locals.company.companies_house_data),
      chDetailsDisplayOrder,
      chDetailsLabels,
    })
  }

  next()
}

module.exports = chDisplayData
