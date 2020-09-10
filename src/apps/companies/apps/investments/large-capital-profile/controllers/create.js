const { createCompanyProfile } = require('../repos')

const createProfile = async (req, res, next) => {
  try {
    const profile = await createCompanyProfile(req, {
      investor_company: req.body.id,
    })
    res.redirect(
      `/companies/${profile.investor_company.id}/investments/large-capital-profile`
    )
  } catch (error) {
    next(error)
  }
}

module.exports = createProfile
