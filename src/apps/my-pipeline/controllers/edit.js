const { getOptions } = require('../../../lib/options')

async function renderEditPipeline(req, res, next) {
  try {
    const { pipelineItemId } = req.params
    const { token } = req.session

    res
      .breadcrumb('Edit your pipeline')
      .render('my-pipeline/views/pipeline-form', {
        heading: `Edit your pipeline`,
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
