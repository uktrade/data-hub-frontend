async function renderUnarchivePipelineItem(req, res) {
  const { pipelineItemId } = req.params

  res.render('my-pipeline/views/unarchive', {
    props: {
      pipelineItemId,
    },
  })
}

module.exports = {
  renderUnarchivePipelineItem,
}
