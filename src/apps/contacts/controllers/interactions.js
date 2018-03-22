function renderInteractions (req, res, next) {
  try {
    res
      .breadcrumb('Interactions')
      .render('contacts/views/interactions', {
        actionButtons: [{
          label: 'Add interaction',
          url: `/contacts/${req.params.contactId}/interactions/create`,
        }],
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
