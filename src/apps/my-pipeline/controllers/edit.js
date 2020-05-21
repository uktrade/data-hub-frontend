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

module.exports = {
  renderEditPipeline,
}
