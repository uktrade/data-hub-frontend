function editAssigneesHandler(req, res) {
  const { id, reference, canEditOrder } = res.locals.order
  res.render('omis/apps/edit/views/assignees', {
    props: { reference, id, canRemoveAssignees: canEditOrder },
  })
}

module.exports = { editAssigneesHandler }
