function renderInteractions (req, res, next) {
  try {
    const { name, id } = res.locals.company

    res
      .breadcrumb(name, `/viewcompanyresult/${id}`)
      .breadcrumb('Interactions')
      .render('companies/views/interactions', {
        tab: 'interactions',
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
