/* eslint camelcase: 0 */
const { get, merge, pickBy, assign } = require('lodash')

const { transformPropositionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { propositionForm } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')

const formConfigs = {
  'proposition': propositionForm,
}

function renderCreatePage (req, res) {
  const propositionData = transformPropositionResponseToForm(res.locals.proposition)
  const propositionDefaults = {
    adviser: req.session.user,
    date: transformDateStringToDateObject(new Date()),
  }

  const mergedPropositionData = pickBy(merge({}, propositionDefaults, propositionData, res.locals.requestBody))
  const propositionId = get(res.locals, 'proposition.id')
  const propositionForm =
    buildFormWithStateAndErrors(
      formConfigs.proposition(
        assign({}, res.locals.options, res.locals.conditions, {
          returnLink: res.locals.returnLink,
          returnText: 'Cancel',
          buttonText: 'Add proposition',
          hiddenFields: {
            id: propositionId,
            investment_project: get(res.locals, 'investment.id'),
          },
        })),
      mergedPropositionData,
      get(res.locals, 'form.errors.messages'),
    )
  const forEntityName = res.locals.investment.name ? ` for ${res.locals.investment.name}` : ''
  const kindName = 'proposition'

  res
    .breadcrumb('Add proposition')
    .title(`Add ${kindName + forEntityName}`)
    .render('propositions/views/create.njk', {
      propositionForm,
    })
}

module.exports = {
  renderCreatePage,
}
