const { getOptions } = require('../../../lib/options')

async function renderEditPipeline(req, res, next) {
  try {
    const { pipelineItemId } = req.params
    const { token } = req.session

    res.render('my-pipeline/views/pipeline-form', {
      props: {
        pipelineItemId,
        sectors: await getOptions(token, 'sector'),
      },
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  renderEditPipeline,
}
