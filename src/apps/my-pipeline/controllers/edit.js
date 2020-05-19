const { authorisedRequest } = require('../../../lib/authorised-request')
const config = require('../../../config')

function renderEditPipeline(req, res) {
  const { pipelineItemId } = req.params
  res
    .breadcrumb('Edit your pipeline')
    .render('my-pipeline/views/pipeline-form', {
      heading: `Edit your pipeline`,
      props: {
        pipelineItemId,
      },
    })
}

async function editCompanyOnPipeline(req, res) {
  const { pipelineItemId } = req.params
  try {
    const response = await authorisedRequest(req.session.token, {
      url: `${config.apiRoot}/v4/pipeline-item/${pipelineItemId}`,
      method: 'PATCH',
      body: req.body,
    })
    req.flash('success', 'Pipeline changes for this company have been saved')
    return res.send(response)
  } catch ({ error, statusCode }) {
    return res.status(statusCode).send(error)
  }
}

module.exports = {
  renderEditPipeline,
  editCompanyOnPipeline,
}
