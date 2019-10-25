/* eslint-disable camelcase */
const { get } = require('lodash')

const { getPrimarySectorName } = require('../../../common/transform-sectors')
const { NOT_SET_TEXT } = require('../constants')

const getCompanySectorUrl = (archived = true, duns_number, companyId) => {
  if (archived) {
    return null
  }

  let url = `/companies/${companyId}`
  return duns_number ? url + '/business-details/sector' : url + '/edit'
}

module.exports = ({
  sector,
  archived,
  duns_number,
  id,
}) => {
  return {
    name: [
      getPrimarySectorName(get(sector, 'name', NOT_SET_TEXT)),
    ],
    url: getCompanySectorUrl(archived, duns_number, id),
  }
}
