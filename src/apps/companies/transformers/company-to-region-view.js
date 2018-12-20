/* eslint-disable camelcase */
const { get } = require('lodash')

const { NOT_SET_TEXT } = require('../constants')

module.exports = ({
  uk_region,
}) => {
  return get(uk_region, 'name', NOT_SET_TEXT)
}
