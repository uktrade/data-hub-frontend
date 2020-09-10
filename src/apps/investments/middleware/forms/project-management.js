const { get, assign } = require('lodash')
const { getAdvisers } = require('../../../adviser/repos')
const { filterActiveAdvisers } = require('../../../adviser/filters')
const { updateInvestment } = require('../../repos')
const { projectManagementLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')

async function populateForm(req, res, next) {
  try {
    const { investment } = res.locals
    const { projects } = res.locals.paths
    const projectManager = get(investment, 'project_manager.id')
    const projectAssuranceAdviser = get(
      investment,
      'project_assurance_adviser.id'
    )

    const advisersResponse = await getAdvisers(req)

    const projectManagers = filterActiveAdvisers({
      advisers: advisersResponse.results,
      includeAdviser: projectManager,
    }).map(transformObjectToOption)

    const projectAssuranceAdvisers = filterActiveAdvisers({
      advisers: advisersResponse.results,
      includeAdviser: projectAssuranceAdviser,
    }).map(transformObjectToOption)

    res.locals.form = assign({}, res.locals.form, {
      labels: projectManagementLabels.edit,
      state: {
        project_manager: projectManager,
        project_assurance_adviser: projectAssuranceAdviser,
      },
      options: {
        projectManagers,
        projectAssuranceAdvisers,
      },
      buttonText: 'Save',
      returnLink: `${projects}/${investment.id}/team`,
      hiddenFields: {
        returnUrl: get(req.query, 'returnUrl'),
      },
    })

    next()
  } catch (error) {
    next(error)
  }
}

function handleFormPost(req, res, next) {
  res.locals.projectId = req.params.investmentId
  updateInvestment(req, res.locals.projectId, req.body)
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
