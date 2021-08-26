const { getOptions } = require('../../../lib/options')

async function renderEditPipeline(req, res, next) {
  try {
    const { pipelineItemId } = req.params

    res.render('my-pipeline/views/pipeline-form', {
      props: {
        pipelineItemId,
        sectors: await getOptions(req, 'sector'),
        features: res.locals.features,
      },
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  renderEditPipeline,
}
