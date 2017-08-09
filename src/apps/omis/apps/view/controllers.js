function renderWorkOrder (req, res, next) {
  res.render('omis/apps/view/views/work-order', {
    values: res.locals.order,
  })
}

module.exports = {
  renderWorkOrder,
}
