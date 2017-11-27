const { get } = require('lodash')
const { getAdvisers } = require('../../../adviser/repos')
const { updateInvestment } = require('../../repos')
const { projectManagementLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')

async function populateForm (req, res, next) {
  try {
    const investmentData = res.locals.investmentData

    const advisersResponse = await getAdvisers(req.session.token)
    const advisers = advisersResponse.results.map(transformObjectToOption)

    res.locals.form = Object.assign({}, res.locals.form, {
      labels: projectManagementLabels.edit,
      state: {
        project_manager: get(investmentData, 'project_manager.id'),
        project_assurance_adviser: get(investmentData, 'project_assurance_adviser.id'),
      },
      options: {
        advisers,
      },
      buttonText: 'Save',
      returnLink: `/investment-projects/${investmentData.id}/team`,
      hiddenFields: {
        returnUrl: get(req.query, 'returnUrl'),
      },
    })

    next()
  } catch (error) {
    next(error)
  }
}

function handleFormPost (req, res, next) {
  res.locals.projectId = req.params.investmentId
  updateInvestment(req.session.token, res.locals.projectId, req.body)
    .then(() => next())
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.form = get(res, 'locals.form', {})
        res.locals.form.errors = err.error
        res.locals.form.state = req.body
        next()
      } else {
        next(err)
      }
    })
}

module.exports = {
  populateForm,
  handleFormPost,
}
