const { get } = require('lodash')

const { getPrimarySectorName } = require('../../../../common/transform-sectors')
const { NOT_SET_TEXT } = require('../constants')

module.exports = ({
  sector,
}) => {
  return [
    getPrimarySectorName(get(sector, 'name', NOT_SET_TEXT)),
  ]
}
