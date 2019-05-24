/* eslint-disable camelcase */
const { formatDate } = require('../../../../../../../config/nunjucks/filters')
const { CLEARED, ISSUES_IDENTIFIED } = require('../constants')
const { get } = require('lodash')

const getRequiredChecksDetails = (type, date, adviser) => {
  const details = [ type.name ]

  if (type.name === CLEARED || type.name === ISSUES_IDENTIFIED) {
    details.push(`Date of most recent background checks: ${formatDate(date, 'DD MM YYYY')}`)
    details.push(`Person responsible for most recent background checks: ${adviser.name}`)
  }

  return details
}

const transformRequiredChecks = (profile) => {
  const type = get(profile, 'required_checks_conducted')
  const date = get(profile, 'required_checks_conducted_on')
  const adviser = get(profile, 'required_checks_conducted_by')

  let value = null
  if (type) {
    value = getRequiredChecksDetails(type, date, adviser)
  }

  return {
    type,
    date,
    adviser,
    value,
  }
}

const transformProfile = (profile, editing) => {
  return {
    id: profile.id,
    editing,
    investorDetails: {
      incompleteFields: get(profile, 'incomplete_details_fields.length'),
      investorType: {
        text: get(profile, 'investor_type.name', null),
        value: get(profile, 'investor_type.id', null),
      },
      globalAssetsUnderManagement: {
        value: get(profile, 'global_assets_under_management'),
      },
      investableCapital: {
        value: get(profile, 'investable_capital'),
      },
      investorDescription: {
        value: get(profile, 'investor_description'),
      },
      requiredChecks: transformRequiredChecks(profile),
    },
    investorRequirements: {
      incompleteFields: get(profile, 'incomplete_requirements_fields.length'),
      dealTicketSizes: {
        value: get(profile, 'deal_ticket_sizes'),
      },
      investmentTypes: {
        value: get(profile, 'investment_types'),
      },
      timeHorizons: {
        value: get(profile, 'time_horizons'),
      },
      restrictions: {
        value: get(profile, 'restrictions'),
      },
      constructionRisks: {
        value: get(profile, 'construction_risks'),
      },
      minimumEquityPercentage: {
        text: get(profile, 'minimum_equity_percentage.name', null),
        value: get(profile, 'minimum_equity_percentage.id', null),
      },
      desiredDealRoles: {
        value: get(profile, 'desired_deal_roles'),
      },
    },
    location: {
      incompleteFields: get(profile, 'incomplete_location_fields.length'),
    },
  }
}

module.exports = transformProfile
