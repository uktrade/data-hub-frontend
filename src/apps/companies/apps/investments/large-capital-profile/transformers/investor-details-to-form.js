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

  if (requiredChecks.conducted) {
    find(radioButtons, (item) => item.value === requiredChecks.conducted.id).checked = true
  }

  const retVal = {
    ...requiredChecks,
    cleared: find(radioButtons, item => item.text === types.CLEARED),
    issuesIdentified: find(radioButtons, item => item.text === types.ISSUES_IDENTIFIED),
    notYetChecked: find(radioButtons, item => item.text === types.NOT_YET_CHECKED),
    notRequired: find(radioButtons, item => item.text === types.CHECKS_NOT_REQUIRED),
  }

  const selectedType = get(requiredChecks, 'conducted.name')
  if (selectedType === types.CLEARED) {
    retVal.cleared.adviser = requiredChecks.conductedBy
    retVal.cleared.date = parseDate(requiredChecks.conductedOn)
  } else if (selectedType === types.ISSUES_IDENTIFIED) {
    retVal.issuesIdentified.adviser = requiredChecks.conductedBy
    retVal.issuesIdentified.date = parseDate(requiredChecks.conductedOn)
  }

  return retVal
}

const transformAdvisers = (advisers) => {
  return advisers.map(transformAdvisersToTypeahead)
}

module.exports = {
  transformAdvisers,
  transformInvestorTypes,
  transformRequiredChecks,
}
