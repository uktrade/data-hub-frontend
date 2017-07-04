const templateData = {
  currentNavItem: 'details',
  variant: 'edit',
}

function editDetailsGet (req, res) {
  res.locals.title.unshift('Edit details')
  res.render('investment-projects/views/details-edit', templateData)
}

function editValueGet (req, res) {
  res.locals.title.unshift('Edit value')
  res.render('investment-projects/views/value-edit', templateData)
}

function editRequirementsGet (req, res) {
  res.render('investment-projects/views/requirements-edit', templateData)
}

function editDetailsPost (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment-projects/views/details-edit', templateData)
  }
  req.flash('success', 'Updated investment details')
  return res.redirect(`/investment/${res.locals.resultId}/details`)
}

function editValuePost (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment-projects/views/value-edit', templateData)
  }
  req.flash('success', 'Updated investment value')
  return res.redirect(`/investment/${res.locals.projectId}/details`)
}

function editRequirementsPost (req, res) {
  if (res.locals.form.errors) {
    req.flash('success', 'Updated investment requirements')
    return res.render('investment-projects/views/requirements-edit', templateData)
  }
  return res.redirect(`/investment/${res.locals.projectId}/details`)
}

module.exports = {
  editDetailsGet,
  editValueGet,
  editRequirementsGet,
  editDetailsPost,
  editValuePost,
  editRequirementsPost,
}
