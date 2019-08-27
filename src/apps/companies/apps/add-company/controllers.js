async function renderAddCompanyForm (req, res, next) {
  try {
    res
      .breadcrumb('Add company')
      .render('companies/apps/add-company/views/client-container')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAddCompanyForm,
}
