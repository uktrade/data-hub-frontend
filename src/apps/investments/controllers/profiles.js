const renderProfilesView = async (req, res, next) => {
  try {
    res.render('investments/views/profiles')
  } catch (error) {
    next(error)
  }
}

module.exports = { renderProfilesView }
