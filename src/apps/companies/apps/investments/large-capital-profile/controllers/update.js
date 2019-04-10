const { updateCompanyProfile } = require('../repos')
const { INVESTOR_DETAILS } = require('../sections')

const updateProfile = async (req, res, next) => {
  const { profileId, editing } = req.body
  const { company } = res.locals
  const { token } = req.session

  const body = {}
  if (editing === INVESTOR_DETAILS) {
    const { investorType } = req.body
    body.investor_type = investorType
  }

  try {
    await updateCompanyProfile(token, body, profileId)
    res.redirect(`/companies/${company.id}/investments/large-capital-profile`)
  } catch (error) {
    next(error)
  }
}

module.exports = updateProfile
