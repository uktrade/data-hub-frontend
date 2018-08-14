const { get } = require('lodash')

const { getAdvisers } = require('../../../adviser/repos')
const { filterActiveAdvisers } = require('../../../adviser/filters')
const { updateCompany } = require('../../../companies/repos')
const { updateInvestment } = require('../../repos')
const { clientRelationshipManagementLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')
const config = require('../../../../../config')

async function populateForm (req, res, next) {
  try {
    const investmentData = res.locals.investmentData
    const clientRelationshipManager = get(investmentData, 'client_relationship_manager.id', null)
    const firstName = get(investmentData, 'investor_company.one_list_account_owner.first_name')
    const lastName = get(investmentData, 'investor_company.one_list_account_owner.last_name')
    const advisersResponse = await getAdvisers(req.session.token)
    const clientRelationshipManagerOptions = filterActiveAdvisers({
      advisers: advisersResponse.results,
      includeAdviser: clientRelationshipManager,
    }).map(transformObjectToOption)

    res.locals.form = Object.assign({}, res.locals.form, {
      labels: clientRelationshipManagementLabels.edit,
      state: {
        client_relationship_manager: clientRelationshipManager,
        global_account_manager: `${firstName} ${lastName}`,
      },
      options: {
        clientRelationshipManagers: clientRelationshipManagerOptions,
      },
      hiddenFields: {
        investor_company: get(investmentData, 'investor_company.id'),
      },
      buttonText: 'Save',
      returnLink: `/investment-projects/${investmentData.id}/team`,
      oneListEmail: config.oneList.email,
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
