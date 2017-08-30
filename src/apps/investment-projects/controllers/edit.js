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

function editRequirementsGet (req, res) {
  res.render('investment-projects/views/requirements-edit')
}

function editDetailsPost (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment-projects/views/details-edit')
  }
  req.flash('success', 'Investment details updated')
  return res.redirect(`/investment-projects/${res.locals.resultId}/details`)
}

function editValuePost (req, res) {
  if (res.locals.form.errors) {
    return res
      .breadcrumb('Edit value')
      .render('investment-projects/views/value-edit')
  }
  req.flash('success', 'Investment value updated')
  return res.redirect(`/investment-projects/${res.locals.projectId}/details`)
}

function editRequirementsPost (req, res) {
  if (res.locals.form.errors) {
    req.flash('success', 'Investment requirements updated')
    return res.render('investment-projects/views/requirements-edit')
  }
  return res.redirect(`/investment-projects/${res.locals.projectId}/details`)
}

module.exports = {
  editDetailsGet,
  editValueGet,
  editRequirementsGet,
  editDetailsPost,
  editValuePost,
  editRequirementsPost,
}
