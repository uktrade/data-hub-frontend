const urls = require('../../../lib/urls')
const { getOptions } = require('../../../lib/options')

async function renderAddToPipeline(req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session
    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb('Add to your pipeline')
      .render('my-pipeline/views/pipeline-form', {
        heading: `Add ${company.name} to your pipeline`,
        props: {
          companyId: company.id,
          companyName: company.name,
          sectors: await getOptions(token, 'sector'),
          contacts: company.contacts,
        },
      })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  renderAddToPipeline,
}
