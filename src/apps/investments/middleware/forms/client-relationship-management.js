const { get } = require('lodash')

const { getAdvisers } = require('../../../adviser/repos')
const { filterActiveAdvisers } = require('../../../adviser/filters')
const { updateInvestment } = require('../../repos')
const { clientRelationshipManagementLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')
const config = require('../../../../config')

async function populateForm(req, res, next) {
  try {
    const { investment } = res.locals
    const { projects } = res.locals.paths
    const clientRelationshipManager = get(
      investment,
      'client_relationship_manager.id',
      null
    )
    const firstName = get(
      investment,
      'investor_company.one_list_group_global_account_manager.first_name'
    )
    const lastName = get(
      investment,
      'investor_company.one_list_group_global_account_manager.last_name'
    )
    const advisersResponse = await getAdvisers(req)
    const clientRelationshipManagerOptions = filterActiveAdvisers({
      advisers: advisersResponse.results,
      includeAdviser: clientRelationshipManager,
    }).map(transformObjectToOption)
    const globalAccountManager =
      firstName && lastName ? `${firstName} ${lastName}` : 'Not set'

    res.locals.form = Object.assign({}, res.locals.form, {
      labels: clientRelationshipManagementLabels.edit,
      state: {
        client_relationship_manager: clientRelationshipManager,
        global_account_manager: globalAccountManager,
      },
      options: {
        clientRelationshipManagers: clientRelationshipManagerOptions,
      },
      hiddenFields: {
        investor_company: get(investment, 'investor_company.id'),
      },
      buttonText: 'Save',
      buttonDataAttr: 'client-relationship-management-save',
      returnLink: `${projects}/${investment.id}/team`,
      oneListEmail: config.oneList.email,
    })

    next()
  } catch (error) {
    next(error)
  }
}

async function handleFormPost(req, res, next) {
  try {
    res.locals.projectId = req.params.investmentId
    await updateInvestment(req, res.locals.projectId, {
      client_relationship_manager: req.body.client_relationship_manager,
    })
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
