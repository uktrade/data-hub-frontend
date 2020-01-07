const editProfile = async (req, res) => {
  const { company } = res.locals
  const { editing } = req.body
  res.redirect(
    `/companies/${company.id}/investments/large-capital-profile?editing=${editing}`
  )
}

module.exports = editProfile
