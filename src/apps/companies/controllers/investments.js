const { getCompanyInvestmentProjects } = require('../../investment-projects/repos')
const { transformInvestmentProjectToListItem } = require('../../investment-projects/transformers')
const { transformApiResponseToCollection } = require('../../transformers')

async function renderInvestments (req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { id, name } = res.locals.company

  try {
    const results = await getCompanyInvestmentProjects(token, id, page)
      .then(transformApiResponseToCollection(
        { query: req.query },
        transformInvestmentProjectToListItem,
      ))

    res
      .breadcrumb(name, `/companies/${id}`)
      .breadcrumb('Investment')
      .render('companies/views/investments', {
        results,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInvestments,
}
