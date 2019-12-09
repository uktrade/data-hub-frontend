const { companies } = require('../../../../lib/urls')

async function renderEditHistory (req, res, next) {
  try {
    const { company } = res.locals

    res
      .breadcrumb(company.name, companies.detail(company.id))
      .breadcrumb('Business details', companies.businessDetails(company.id))
      .breadcrumb('Edit History')
      .render('companies/apps/edit-history/views/client-container', {
        props: {},
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditHistory,
}
