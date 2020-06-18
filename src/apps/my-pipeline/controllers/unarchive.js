async function renderUnarchivePipelineItem(req, res) {
  const { pipelineItemId } = req.params

  res.breadcrumb('Unarchive project').render('my-pipeline/views/unarchive', {
    heading: `Unarchive project`,
    props: {
      pipelineItemId,
    },
  })
}

module.exports = {
  renderUnarchivePipelineItem,
}
