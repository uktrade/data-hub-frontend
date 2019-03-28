const editProfile = async (req, res) => {
  const { company } = res.locals
  const { edit } = req.body
  res.redirect(`/companies/${company.id}/investments/large-capital-profile?edit=${edit}`)
}

module.exports = editProfile
