const { isValidGuid } = require('../../../lib/controller-utils')
const { companyLabels } = require('../labels')
const { getDitCompany } = require('../repos')
const { getCompanyType, getHeadingName, getHeadingAddress } = require('../services/data')

async function getCompanyData (req, res, next) {
  try {
    const id = req.params.id
    if (!isValidGuid(id)) {
      return next()
    }

    const company = await getDitCompany(req.session.token, id)

    res.locals = Object.assign({}, res.locals, {
      company,
      companyType: getCompanyType(company),
      headingName: getHeadingName(company),
      headingAddress: getHeadingAddress(company),
      companyURl: `/companies/${company.id}/details`,
      companyLabels,
    })

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = getCompanyData
