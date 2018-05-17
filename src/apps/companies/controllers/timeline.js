const { getCompanyTimeline } = require('../repos')
const { transformTimelineToListItem } = require('../../timeline/transformers')
const { transformApiResponseToCollection } = require('../../transformers')

async function renderTimeline (req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { id, name } = res.locals.company

  try {
    const timeline = await getCompanyTimeline(token, id, page)
      .then(transformApiResponseToCollection(
        { entityType: 'timeline' },
        transformTimelineToListItem
      ))

    res
      .breadcrumb(name, `/companies/${id}`)
      .breadcrumb('Timeline')
      .render('companies/views/timeline', { timeline })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderTimeline,
}
