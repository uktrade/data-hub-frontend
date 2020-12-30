const renderProjectsView = async (req, res, next) => {
  try {
    const { user } = req.session
    const currentAdviserId = user.id

    const props = {
      title: 'Investment Projects',
      countLabel: 'project',
      heading: 'Investments',
      currentAdviserId,
    }

    return res
      .breadcrumb('Projects')
      .render('investments/views/projects', { props })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderProjectsView,
}
