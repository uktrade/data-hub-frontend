const { title } = require('case')

const { getCompaniesHouse } = require('./repos')
const { getDisplayCompaniesHouse } = require('./services/formatting')
const { companiesHouseDetailsLabels } = require('./labels')

const companiesHouseDetailsDisplayOrder = [
  'name',
  'company_number',
  'registered_address',
  'business_type',
  'company_status',
  'incorporation_date',
  'sic_code',
]

async function getDetails (req, res, next) {
  try {
    const companiesHouse = await getCompaniesHouse(req.session.token, req.params.id)
    const headingName = title(companiesHouse.name)

    res.render('companies-house/views/details', {
      headingName,
      tab: 'details',
      companiesHouseDetails: getDisplayCompaniesHouse(companiesHouse),
      companiesHouseDetailsDisplayOrder,
      companiesHouseDetailsLabels,
      addUrl: `/company/add/ltd/${companiesHouse.company_number}`,
      title: [headingName, 'Companies House'],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
}
