/* eslint-disable camelcase */
const { find, get } = require('lodash')
const moment = require('moment')
const types = require('../constants')

const transformObjectToOption = ({ value, label }) => ({ value, text: label })
const transformAdvisersToTypeahead = ({ name, dit_team, id }) => ({ label: name, subLabel: dit_team.name, value: id })

const parseDate = (dateStr) => {
  const date = moment(dateStr, 'YYYY-MM-DD', true)
  return {
    day: date.date(),
    month: date.month() + 1,
    year: date.year(),
  }
}

const transformInvestorTypes = (investorTypes, { investorType }) => {
  const options = investorTypes.map(transformObjectToOption)
  const { value } = investorType

  if (value) {
    find(options, (item) => item.value === value).selected = true
  }

  options.unshift({
    value: null,
    text: '-- Please select an investor type --',
  })

  return options
}

const transformRequiredChecks = (requiredChecksMetaData, { requiredChecks }) => {
  const radioButtons = requiredChecksMetaData.map(transformObjectToOption)

  const transformed = {
    cleared: find(radioButtons, item => item.text === types.CLEARED),
    issuesIdentified: find(radioButtons, item => item.text === types.ISSUES_IDENTIFIED),
    notYetChecked: find(radioButtons, item => item.text === types.NOT_YET_CHECKED),
    notRequired: find(radioButtons, item => item.text === types.CHECKS_NOT_REQUIRED),
  }

  const type = get(requiredChecks, 'type.name')

  if (type === types.CLEARED) {
    transformed.cleared.adviser = requiredChecks.adviser
    transformed.cleared.date = parseDate(requiredChecks.date)
  }

  if (type === types.ISSUES_IDENTIFIED) {
    transformed.issuesIdentified.adviser = requiredChecks.adviser
    transformed.issuesIdentified.date = parseDate(requiredChecks.date)
  }

  const id = get(requiredChecks, 'type.id')
  if (id) {
    find(radioButtons, (item) => item.value === id).checked = true
  }

  return transformed
}

const transformAdvisers = (advisers) => {
  return advisers.map(transformAdvisersToTypeahead)
}

module.exports = {
  transformAdvisers,
  transformInvestorTypes,
  transformRequiredChecks,
}
