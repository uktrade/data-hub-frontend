const { getOptions } = require('../../../lib/options')

async function renderAddToPipeline(req, res, next) {
  try {
    const { company } = res.locals

    res.locals.title = `Add to your pipeline - ${company.name} - Companies`

    res.render('my-pipeline/views/pipeline-form', {
      props: {
        companyId: company.id,
        companyName: company.name,
        sectors: await getOptions(req, 'sector'),
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
