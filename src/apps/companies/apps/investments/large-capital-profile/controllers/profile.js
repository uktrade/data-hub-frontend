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

const getConstructionRisks = async (token, profile) => {
  const constructionRisks = await getOptions(token, 'capital-investment/construction-risk', { sorted: false })
  return transformCheckboxes(constructionRisks, profile.investorRequirements.constructionRisks)
}

const getDesiredDealRoles = async (token, profile) => {
  const desiredDealRoles = await getOptions(token, 'capital-investment/desired-deal-role', { sorted: false })
  return transformCheckboxes(desiredDealRoles, profile.investorRequirements.desiredDealRoles)
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
      const promises = [
        getDealTicketSizes(token, profile),
        getInvestmentTypes(token, profile),
        getTimeHorizons(token, profile),
        getRestrictions(token, profile),
        getConstructionRisks(token, profile),
        getDesiredDealRoles(token, profile),
      ]

      await Promise.all(promises).then(([
        dealTicketSizes,
        investmentTypes,
        timeHorizons,
        restrictions,
        constructionRisks,
        desiredDealRoles,
      ]) => {
        profile.investorRequirements.dealTicketSizes.items = dealTicketSizes
        profile.investorRequirements.investmentTypes.items = investmentTypes
        profile.investorRequirements.timeHorizons.items = timeHorizons
        profile.investorRequirements.restrictions.items = restrictions
        profile.investorRequirements.constructionRisks.items = constructionRisks
        profile.investorRequirements.desiredDealRoles.items = desiredDealRoles
      })
    }

    res.render('companies/apps/investments/large-capital-profile/views/profile', { profile })
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
