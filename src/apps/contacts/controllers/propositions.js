function renderPropositions (req, res, next) {
  try {
    res
      .breadcrumb('Propositions')
      .render('contacts/views/propositions', {
        actionButtons: [{
          label: 'Add proposition',
          url: `/contacts/${req.params.contactId}/propositions/create`,
        }],
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderPropositions,
}
