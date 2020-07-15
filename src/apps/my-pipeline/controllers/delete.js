async function renderDeletePipelineItem(req, res) {
  const { pipelineItemId } = req.params

  res.render('my-pipeline/views/delete', {
    props: {
      pipelineItemId,
    },
  })
}

module.exports = {
  renderDeletePipelineItem,
}
