async function renderDeletePipelineItem(req, res) {
  const { pipelineItemId } = req.params

  res.breadcrumb('Delete project').render('my-pipeline/views/delete', {
    heading: `Delete project`,
    props: {
      pipelineItemId,
    },
  })
}

module.exports = {
  renderDeletePipelineItem,
}
