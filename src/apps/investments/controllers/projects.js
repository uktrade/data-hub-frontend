const renderProjectsView = async (req, res, next) => {
  try {
    const props = {
      title: 'Investment Projects',
      countLabel: 'project',
      heading: 'Investments',
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
