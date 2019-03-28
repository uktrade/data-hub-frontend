const updateProfile = async (req, res) => {
  // TODO: Update company profile
  // 1. Extract post data
  // 2. Transform data
  // 3. Make API call into /v4/large-investor-profile/profileId
  // 4. Redirect to profile page
  const { company } = res.locals
  res.redirect(`/companies/${company.id}/investments/large-capital-profile`)
}

module.exports = updateProfile
