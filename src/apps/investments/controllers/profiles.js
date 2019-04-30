const renderProfilesView = async (req, res, next) => {
  try {
    const props = {
      title: 'Investments',
      countLabel: 'large capital profile',
      actionButtons: [{
        label: 'Create a profile',
        url: '/investments/profiles/create-investor-profile',
      }],
    }

    res.render('investments/views/profiles', props)
  } catch (error) {
    next(error)
  }
}

module.exports = { renderProfilesView }
