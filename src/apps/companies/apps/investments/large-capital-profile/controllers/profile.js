const {
  transformProfile,
  transformAdvisers,
  transformInvestorTypes,
  transformRequiredChecks,
} = require('../transformers')

const { getOptions } = require('../../../../../../lib/options')
const { getAdvisers } = require('../../../../../adviser/repos')
const { getCompanyProfiles } = require('../repos')
const { INVESTOR_DETAILS } = require('../sections')
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

    if (get(profile, 'editing') === INVESTOR_DETAILS) {
      profile.investorDetails.investorType.items = await getInvestorTypes(token, profile)
      profile.investorDetails.requiredChecks = await getRequiredChecks(token, profile)

      const advisers = await getRequiredChecksAdvisers(token)
      profile.investorDetails.requiredChecks.cleared.advisers = advisers
      profile.investorDetails.requiredChecks.issuesIdentified.advisers = advisers
    }

    res.render('companies/apps/investments/large-capital-profile/views/profile', { profile })
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
