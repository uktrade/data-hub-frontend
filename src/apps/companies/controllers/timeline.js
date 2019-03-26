const { getCompanyTimeline } = require('../repos')
const { transformTimelineToListItem } = require('../../timeline/transformers')
const { transformApiResponseToCollection } = require('../../../modules/api/transformers')

async function renderTimeline (req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { company } = res.locals
  try {
    const timeline = await getCompanyTimeline(token, company.id, page)
      .then(transformApiResponseToCollection(
        { query: req.query },
        transformTimelineToListItem
      ))

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Timeline')
      .render('companies/views/timeline', {
        timeline,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderTimeline,
}
