const { transformProfile, transformInvestorTypes } = require('../transformers')
const { getOptions } = require('../../../../../../lib/options')
const { getCompanyProfiles } = require('../repos')
const { INVESTOR_DETAILS } = require('../sections')

const getInvestorTypes = (token, profile) => {
  return getOptions(token, 'capital-investment/investor-type')
    .then((investorTypes) => {
      return transformInvestorTypes(investorTypes, profile)
    })
}

const getCompanyProfile = (token, company, editing) => {
  return getCompanyProfiles(token, company.id)
    .then((profiles) => {
      let profile = profiles.results && profiles.results[0]
      return profile ? transformProfile(Object.freeze(profile), editing) : profile
    })
}

const renderProfile = async (req, res, next) => {
  const { token } = req.session
  const { company } = res.locals
  const { editing } = req.query

  try {
    const profile = await getCompanyProfile(token, company, editing)

    if (profile && profile.editing) {
      if (profile.editing === INVESTOR_DETAILS) {
        profile.investorDetails.investorType.items = await getInvestorTypes(token, profile)
      }
    }

    res.render('companies/apps/investments/large-capital-profile/views/profile', { profile })
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
