function renderInteractions (req, res, next) {
  try {
    const { name, id } = res.locals.company

    res
      .breadcrumb(name, `/companies/${id}`)
      .breadcrumb('Interactions')
      .render('companies/views/interactions')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
