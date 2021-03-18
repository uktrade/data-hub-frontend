/* eslint-disable camelcase */
const { formatDate } = require('../../../../../../config/nunjucks/filters')
const { requiredChecks } = require('../constants')
const { get } = require('lodash')

const getRequiredChecksDetails = (type, date, adviser) => {
  const details = [type.name]

  if (
    type.name === requiredChecks.CLEARED ||
    type.name === requiredChecks.ISSUES_IDENTIFIED
  ) {
    details.push(
      `Date of most recent background checks: ${formatDate(date, 'dd MM yyyy')}`
    )
    details.push(
      `Person responsible for most recent background checks: ${adviser.name}`
    )
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
      assetClasses: {
        energyAndInfrastructure: {
          value: get(profile, 'asset_classes_of_interest'),
        },
        realEstate: {
          value: get(profile, 'asset_classes_of_interest'),
        },
      },
      investmentTypes: {
        value: get(profile, 'investment_types'),
      },
      minimumReturnRate: {
        text: get(profile, 'minimum_return_rate.name', null),
        value: get(profile, 'minimum_return_rate.id', null),
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
      notes_on_locations: get(profile, 'notes_on_locations'),
      uk_region_locations: {
        value: get(profile, 'uk_region_locations', null),
      },
      other_countries_being_considered: {
        value: get(profile, 'other_countries_being_considered', null),
      },
    },
  }
}

module.exports = transformProfile
