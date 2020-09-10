const logger = require('../../../../config/logger')
const { updateInvestment } = require('../../repos')

function handleFormPost(req, res, next, projectId = req.params.investmentId) {
  updateInvestment(req, projectId, {
    stage: {
      id: req.body.next_project_stage,
    },
  })
    .then(() => {
      const { id } = res.locals.investment
      const { projects } = res.locals.paths
      const { name } = res.locals.investmentStatus.nextStage

      req.flash('success', `Investment project moved to ${name} stage`)
      res.redirect(`${projects}/${id}/details`)
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        logger.error(err)
        req.flash(
          'error',
          err.error.stage
            ? err.error.stage.toString()
            : 'Something has gone wrong'
        )

        const { projects } = res.locals.paths
        const { id } = res.locals.investment
        return res.redirect(`${projects}/${id}/details`)
      }
      next(err)
    })
}

module.exports = {
  handleFormPost,
}
