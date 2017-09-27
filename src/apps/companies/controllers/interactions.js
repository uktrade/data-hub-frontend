function renderInteractions (req, res, next) {
  try {
    const { name, id } = res.locals.company

    res
      .breadcrumb(name, `/viewcompanyresult/${id}`)
      .breadcrumb('Interactions')
      .render('companies/views/interactions', {
        tab: 'interactions', // TODO: Use newer local nav macro to remove need for this
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
