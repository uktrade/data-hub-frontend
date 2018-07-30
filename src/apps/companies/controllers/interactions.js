function renderInteractions (req, res, next) {
  try {
    const { name, id, archived } = res.locals.company

    const actionButtons = archived ? undefined : [{
      label: 'Add interaction',
      url: `/companies/${id}/interactions/create`,
    }]

    res
      .breadcrumb(name, `/companies/${id}`)
      .breadcrumb('Interactions')
      .render('companies/views/interactions', {
        actionButtons,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
