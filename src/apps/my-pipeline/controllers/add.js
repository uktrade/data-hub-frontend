const urls = require('../../../lib/urls')
const { authorisedRequest } = require('../../../lib/authorised-request')
const config = require('../../../config')

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

async function addCompanyToPipeline(req, res) {
  try {
    const response = await authorisedRequest(req.session.token, {
      url: `${config.apiRoot}/v4/pipeline-item`,
      method: 'POST',
      body: req.body,
    })
    req.flash('success', 'Pipeline changes for this company have been saved')
    return res.send(response)
  } catch ({ error, statusCode }) {
    return res.status(statusCode).send(error)
  }
}

module.exports = {
  renderAddToPipeline,
  addCompanyToPipeline,
}
