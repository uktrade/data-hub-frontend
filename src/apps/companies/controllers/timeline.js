const { getCompanyTimeline } = require('../repos')
const { transformTimelineToListItem } = require('../../timeline/transformers')
const { transformApiResponseToCollection } = require('../../../modules/api/transformers')

async function renderTimeline (req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { company, features } = res.locals
  const view = (company.duns_number || features['companies-new-layout'])
    ? 'companies/views/timeline'
    : 'companies/views/_deprecated/timeline'

  try {
    const timeline = await getCompanyTimeline(token, company.id, page)
      .then(transformApiResponseToCollection(
        { query: req.query },
        transformTimelineToListItem
      ))

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Timeline')
      .render(view, {
        timeline,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderTimeline,
}
