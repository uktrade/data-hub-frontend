const { getFormattedAddress } = require('../../../lib/address')
const { getCHCompany } = require('../repository')
const { getDisplayCH } = require('../services/formatting.service')
const { chDetailsLabels } = require('../labels')

const chDetailsDisplayOrderLong = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']

async function getDetails (req, res, next) {
  try {
    const company = await getCHCompany(req.session.token, req.params.id)
    res.locals.tab = 'details'
    res.locals.headingName = company.name
    res.locals.headingAddress = getFormattedAddress(company, 'registered')

    res.locals.chDetails = getDisplayCH(company)
    res.locals.chDetailsDisplayOrder = chDetailsDisplayOrderLong
    res.locals.chDetailsLabels = chDetailsLabels
    res.locals.addUrl = `/company/add/ltd/${company.company_number}`
    res.locals.title = [company.name, 'Companies']

    res.render('companies/views/details-ch')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
}
