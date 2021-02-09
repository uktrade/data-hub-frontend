const renderProfilesView = async (req, res, next) => {
  try {
    res.breadcrumb('Profiles').render('investments/views/profiles', {
      heading: 'Investments',
      props: {
        filtersFeatureEnabled:
          res.locals.features['capital-investments-filters'],
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { renderProfilesView }
