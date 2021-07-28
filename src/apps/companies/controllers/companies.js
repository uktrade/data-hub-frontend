const renderCompaniesView = async (req, res, next) => {
  try {
    const { user } = req.session
    const currentAdviserId = user.id

    const props = {
      title: 'Companies',
      heading: 'Companies',
      currentAdviserId,
      features: res.locals.features,
    }

    return res.render('companies/views/companies', { props })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderCompaniesView,
}
