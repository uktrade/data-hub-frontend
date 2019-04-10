/* eslint-disable camelcase */
const { find } = require('lodash')

const transformObjectToOption = ({ value, label }) => ({ value, text: label })

const transformInvestorTypes = (investorTypes, { investorDetails }) => {
  const options = investorTypes.map(transformObjectToOption)
  const { value } = investorDetails.investorType

  if (value) {
    find(options, (item) => item.value === value).selected = true
  }

  options.unshift({
    value: 'default',
    text: '-- Please select an investor type --',
  })

  return options
}

module.exports = {
  transformInvestorTypes,
}
