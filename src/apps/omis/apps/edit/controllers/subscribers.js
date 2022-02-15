function editSubscribersHandler(req, res) {
  const { id, reference, canEditOrder } = res.locals.order
  res.render('omis/apps/edit/views/subscribers', {
    props: { reference, id, canRemoveSubscribers: canEditOrder },
  })
}

module.exports = { editSubscribersHandler }
