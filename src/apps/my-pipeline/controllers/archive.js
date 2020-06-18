async function renderArchivePipelineItem(req, res, next) {
  try {
    const { pipelineItemId } = req.params

    res.breadcrumb('Archive project').render('my-pipeline/views/archive', {
      heading: `Archive project`,
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
