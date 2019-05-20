const {
  transformProfile,
  transformAdvisers,
  transformCheckboxes,
  transformInvestorTypes,
  transformRequiredChecks,
} = require('../transformers')

const { getOptions } = require('../../../../../../lib/options')
const { getAdvisers } = require('../../../../../adviser/repos')
const { getCompanyProfiles } = require('../repos')
const { INVESTOR_DETAILS, INVESTOR_REQUIREMENTS } = require('../sections')
const { get } = require('lodash')

const getInvestorTypes = async (token, profile) => {
  const investorTypes = await getOptions(token, 'capital-investment/investor-type')
  return transformInvestorTypes(investorTypes, profile.investorDetails)
}

const getRequiredChecks = async (token, profile) => {
  const requiredChecks = await getOptions(token, 'capital-investment/required-checks-conducted')
  return transformRequiredChecks(requiredChecks, profile.investorDetails)
}

const getRequiredChecksAdvisers = async (token) => {
  const advisers = await getAdvisers(token)
  return transformAdvisers(advisers.results)
}

const getDealTicketSizes = async (token, profile) => {
  const dealTicketSizes = await getOptions(token, 'capital-investment/deal-ticket-size', { sorted: false })
  return transformCheckboxes(dealTicketSizes, profile.investorRequirements.dealTicketSizes)
}

const getInvestmentTypes = async (token, profile) => {
  const investmentType = await getOptions(token, 'capital-investment/large-capital-investment-type')
  return transformCheckboxes(investmentType, profile.investorRequirements.investmentTypes)
}

const getTimeHorizons = async (token, profile) => {
  const timeHorizons = await getOptions(token, 'capital-investment/time-horizon', { sorted: false })
  return transformCheckboxes(timeHorizons, profile.investorRequirements.timeHorizons)
}

const getRestrictions = async (token, profile) => {
  const restriction = await getOptions(token, 'capital-investment/restriction', { sorted: false })
  return transformCheckboxes(restriction, profile.investorRequirements.restrictions)
}

const getCompanyProfile = async (token, company, editing) => {
  const profiles = await getCompanyProfiles(token, company.id)
  const profile = profiles.results && profiles.results[0]
  return profile ? transformProfile(Object.freeze(profile), editing) : profile
}

const renderProfile = async (req, res, next) => {
  const { token } = req.session
  const { company } = res.locals
  const { editing } = req.query

  try {
    const profile = await getCompanyProfile(token, company, editing)
    const editType = get(profile, 'editing')

    if (editType === INVESTOR_DETAILS) {
      profile.investorDetails.investorType.items = await getInvestorTypes(token, profile)
      profile.investorDetails.requiredChecks = await getRequiredChecks(token, profile)
      const advisers = await getRequiredChecksAdvisers(token)
      profile.investorDetails.requiredChecks.cleared.advisers = advisers
      profile.investorDetails.requiredChecks.issuesIdentified.advisers = advisers
    } else if (editType === INVESTOR_REQUIREMENTS) {
      profile.investorRequirements.dealTicketSizes.items = await getDealTicketSizes(token, profile)
      profile.investorRequirements.investmentTypes.items = await getInvestmentTypes(token, profile)
      profile.investorRequirements.timeHorizons.items = await getTimeHorizons(token, profile)
      profile.investorRequirements.restrictions.items = await getRestrictions(token, profile)
    }

    res.render('companies/apps/investments/large-capital-profile/views/profile', { profile })
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
