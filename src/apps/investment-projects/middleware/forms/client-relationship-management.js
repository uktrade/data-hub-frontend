const { get } = require('lodash')
const { getAdvisers } = require('../../../adviser/repos')
const { updateCompany } = require('../../../companies/repos')
const { updateInvestment } = require('../../repos')
const { clientRelationshipManagementLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')

async function populateForm (req, res, next) {
  try {
    const investmentData = res.locals.investmentData

    // Todo - update to pass parameter to just get active advisers and
    // pass in the existing adviser id to make sure it is not filtered out
    const advisersResponse = await getAdvisers(req.session.token)
    const advisers = advisersResponse.results.map(transformObjectToOption)

    res.locals.form = Object.assign({}, res.locals.form, {
      labels: clientRelationshipManagementLabels.edit,
      state: {
        client_relationship_manager: get(investmentData, 'client_relationship_manager.id', null),
        account_manager: get(investmentData, 'investor_company.account_manager.id', null),
      },
      options: {
        advisers,
      },
      hiddenFields: {
        investor_company: get(investmentData, 'investor_company.id'),
      },
      buttonText: 'Save',
      returnLink: `/investment-projects/${investmentData.id}/team`,
    })

    next()
  } catch (error) {
    next(error)
  }
}

async function handleFormPost (req, res, next) {
  try {
    res.locals.projectId = req.params.investmentId
    await updateCompany(req.session.token, req.body.investor_company, { account_manager: req.body.account_manager })
    await updateInvestment(req.session.token, res.locals.projectId, { client_relationship_manager: req.body.client_relationship_manager })
    next()
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = Object.assign({}, res.locals.form, {
        errors: err.error,
        state: req.body,
      })
      next()
    } else {
      next(err)
    }
  }
}

module.exports = {
  populateForm,
  handleFormPost,
}
