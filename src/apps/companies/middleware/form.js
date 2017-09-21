const { assign } = require('lodash')

const metadataRepository = require('../../../lib/metadata')
const { companyDetailsLabels, hqLabels } = require('../labels')

function populateForm (req, res, next) {
  res.locals = assign({}, res.locals, {
    hqLabels,
    companyDetailsLabels,
    regionOptions: metadataRepository.regionOptions,
    sectorOptions: metadataRepository.sectorOptions,
    employeeOptions: metadataRepository.employeeOptions,
    turnoverOptions: metadataRepository.turnoverOptions,
    headquarterOptions: metadataRepository.headquarterOptions,
    countryOptions: metadataRepository.countryOptions,
  })

  next()
}

module.exports = {
  populateForm,
}
