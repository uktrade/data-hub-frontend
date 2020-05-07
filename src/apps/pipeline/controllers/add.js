const urls = require('../../../lib/urls')

function renderAddToPipeline(req, res) {
  const { company } = res.locals
  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Add to your pipeline')
    .render('pipeline/views/add-to-pipeline', {
      heading: `Add ${company.name} to your pipeline`,
      props: {
        companyId: company.id,
        companyName: company.name,
      },
    })
}

module.exports = {
  renderAddToPipeline,
}
