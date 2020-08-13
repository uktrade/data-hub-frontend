const renderProfilesView = async (req, res, next) => {
  try {
    res
      .breadcrumb('Profiles')
      .render('investments/views/profiles', { heading: 'Investments' })
  } catch (error) {
    next(error)
  }
}

module.exports = { renderProfilesView }
