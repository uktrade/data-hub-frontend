async function renderArchivePipelineItem(req, res, next) {
  try {
    const { pipelineItemId } = req.params

    res.render('my-pipeline/views/archive', {
      props: {
        pipelineItemId,
      },
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  renderArchivePipelineItem,
}
