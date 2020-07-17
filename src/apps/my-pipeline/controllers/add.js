const { getOptions } = require('../../../lib/options')

async function renderAddToPipeline(req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session

    res.render('my-pipeline/views/pipeline-form', {
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
