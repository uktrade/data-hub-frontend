function editDetailsGet (req, res) {
  res
    .breadcrumb('Edit details')
    .render('investment-projects/views/details-edit')
}

function editValueGet (req, res) {
  res
    .breadcrumb('Edit value')
    .render('investment-projects/views/value-edit')
}

function renderRequirementsForm (req, res) {
  res.render('investment-projects/views/requirements-edit')
}

function editDetailsPost (req, res, next) {
  if (res.locals.form.errors || req.body['add-item']) {
    return next()
  }
  req.flash('success', 'Investment details updated')
  const { projects } = res.locals.paths
  return res.redirect(`${projects}/${res.locals.resultId}/details`)
}

function renderValueForm (req, res) {
  return res.render('investment-projects/views/value-edit')
}

module.exports = {
  editDetailsGet,
  editValueGet,
  renderRequirementsForm,
  editDetailsPost,
  renderValueForm,
}
