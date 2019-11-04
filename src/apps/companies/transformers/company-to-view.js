/* eslint-disable camelcase */
const { get, pickBy } = require('lodash')

const { getPrimarySectorName } = require('../../../common/transform-sectors')
const { getDataLabels } = require('../../../lib/controller-utils')
const { companyDetailsLabels, hqLabels } = require('../labels')

module.exports = function transformCompanyToView ({
  sector,
  headquarter_type,
}) {
  const viewRecord = {
    sector: getPrimarySectorName(get(sector, 'name')),
    headquarter_type: hqLabels[get(headquarter_type, 'name')] || 'Not a headquarters',
  }

  return pickBy(getDataLabels(viewRecord, companyDetailsLabels))
}
