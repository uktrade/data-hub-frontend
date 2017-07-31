const { isEmpty } = require('lodash')

const { updateInvestment } = require('../../repos')

function handleFormPost (req, res, next, projectId = req.params.id) {
  const projectPage = req.get('Referrer').split('/').pop()

  updateInvestment(req.session.token, projectId, {
    stage: {
      id: req.body.next_project_stage,
    },
  })
    .then(() => {
      req.flash('success', `Investment project moved to ${res.locals.investmentStatus.nextStage.name} stage`)
      return res.redirect(`/investment-projects/${res.locals.investmentData.id}/${projectPage}`)
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        if (!isEmpty(err.error)) {
          req.form({
            errors: {
              summary: `Complete this section to move to the ${res.locals.investmentStatus.nextStage.name} stage`,
            },
          })
        }

        return res.redirect(`/investment-projects/${res.locals.investmentData.id}/${projectPage}`)
      } else {
        next(err)
      }
    })
}

module.exports = {
  handleFormPost,
}
