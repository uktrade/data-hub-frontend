const {
  transformProfile,
  transformAdvisers,
  transformCheckboxes,
  transformInvestorTypes,
  transformRequiredChecks,
} = require('../transformers')

const { getInvestorDetailsOptions, getInvestorRequirementsOptions } = require('../options')
const { INVESTOR_DETAILS, INVESTOR_REQUIREMENTS } = require('../sections')
const { getCompanyProfiles } = require('../repos')
const { get } = require('lodash')

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
      await Promise.all(getInvestorDetailsOptions(token))
        .then(([
          investorTypeMD,
          requiredCheckMD,
          adviserMD ]) => {
          profile.investorDetails.investorType.items = transformInvestorTypes(investorTypeMD, profile.investorDetails)
          profile.investorDetails.requiredChecks = transformRequiredChecks(requiredCheckMD, profile.investorDetails)
          profile.investorDetails.requiredChecks.cleared.advisers = transformAdvisers(adviserMD.results)
          profile.investorDetails.requiredChecks.issuesIdentified.advisers = transformAdvisers(adviserMD.results)
        })
    } else if (editType === INVESTOR_REQUIREMENTS) {
      await Promise.all(getInvestorRequirementsOptions(token))
        .then(([
          dealTicketSizeMD,
          investmentTypeMD,
          timeHorizonMD,
          restrictionMD,
          constructionRiskMD,
          desiredDealRoleMD,
        ]) => {
          const {
            dealTicketSizes,
            investmentTypes,
            timeHorizons,
            restrictions,
            constructionRisks,
            desiredDealRoles,
          } = profile.investorRequirements

          profile.investorRequirements.dealTicketSizes.items = transformCheckboxes(dealTicketSizeMD, dealTicketSizes)
          profile.investorRequirements.investmentTypes.items = transformCheckboxes(investmentTypeMD, investmentTypes)
          profile.investorRequirements.timeHorizons.items = transformCheckboxes(timeHorizonMD, timeHorizons)
          profile.investorRequirements.restrictions.items = transformCheckboxes(restrictionMD, restrictions)
          profile.investorRequirements.constructionRisks.items = transformCheckboxes(constructionRiskMD, constructionRisks)
          profile.investorRequirements.desiredDealRoles.items = transformCheckboxes(desiredDealRoleMD, desiredDealRoles)
        })
    }

    res.render('companies/apps/investments/large-capital-profile/views/profile', { profile })
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
