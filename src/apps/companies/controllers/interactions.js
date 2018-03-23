function renderInteractions (req, res, next) {
  try {
    const { name, id } = res.locals.company

    res
      .breadcrumb(name, `/companies/${id}`)
      .breadcrumb('Interactions')
      .render('companies/views/interactions', {
        actionButtons: [{
          label: 'Add interaction',
          url: `/companies/${req.params.companyId}/interactions/create`,
        }],
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
