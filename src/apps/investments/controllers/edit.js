// For projects landing after 01/04/2020, the project value field is not needed
const valueCutOffDate = new Date('2020-04-01')

function editDetailsGet(req, res) {
  const { investment } = res.locals
  const { user } = req.session
  res.breadcrumb('Edit details').render('investments/views/details-edit', {
    props: {
      projectId: investment.id,
      currentAdviser: user.id,
    },
  })
}

function editValueGet(req, res) {
  const {
    estimated_land_date: estimatedLandDate,
    actual_land_date: actualLandDate,
  } = res.locals.form.state
  const datesBeforeCutOff = [estimatedLandDate, actualLandDate].some(
    (date) => date !== null && new Date(date) < valueCutOffDate
  )

  res.breadcrumb('Edit value').render('investments/views/value-edit', {
    projectValueNeeded: datesBeforeCutOff,
  })
}

function renderRequirementsForm(req, res) {
  const { investment } = res.locals
  res
    .breadcrumb('Edit requirements')
    .render('investments/views/requirements-edit', {
      props: {
        projectId: investment.id,
      },
    })
}

function renderValueForm(req, res) {
  return res.render('investments/views/value-edit')
}

module.exports = {
  editDetailsGet,
  editValueGet,
  renderRequirementsForm,
  renderValueForm,
}
