const urls = require('../../../lib/urls')

function renderAddToPipeline(req, res) {
  const { company } = res.locals
  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Add to your pipeline')
    .render('my-pipeline/views/pipeline-form', {
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
