// For projects landing after 01/04/2020, the project value field is not needed
const valueCutOffDate = new Date('2020-04-01')

function editDetailsGet(req, res) {
  res.breadcrumb('Edit details').render('investments/views/details-edit')
}

function editValueGet(req, res) {
  const {
    estimated_land_date: estimatedLandDate,
    actual_land_date: actualLandDate,
  } = res.locals.form.state

  res.breadcrumb('Edit value').render('investments/views/value-edit', {
    projectValueNeeded:
      (estimatedLandDate || actualLandDate) &&
      new Date(estimatedLandDate || actualLandDate) < valueCutOffDate,
  })
}

function renderRequirementsForm(req, res) {
  res.render('investments/views/requirements-edit')
}

function editDetailsPost(req, res, next) {
  if (res.locals.form.errors || req.body['add-item']) {
    return next()
  }

  const { resultId } = res.locals
  const { projects } = res.locals.paths

  req.flash('success', 'Investment details updated')
  return res.redirect(`${projects}/${resultId}/details`)
}

function renderValueForm(req, res) {
  return res.render('investments/views/value-edit')
}

module.exports = {
  editDetailsGet,
  editValueGet,
  renderRequirementsForm,
  editDetailsPost,
  renderValueForm,
}
