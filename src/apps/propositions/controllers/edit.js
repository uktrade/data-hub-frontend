/* eslint camelcase: 0 */
const { get, merge, pickBy, lowerCase, assign } = require('lodash')

const { transformPropositionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { propositionForm } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const formConfigs = {
  'proposition': propositionForm,
}

function renderEditPage (req, res) {
  const propositionData = transformPropositionResponseToForm(res.locals.proposition)
  const propositionDefaults = {
    adviser: req.session.user,
    date: transformDateStringToDateObject(new Date()),
    // contact: get(res.locals, 'contact.id'),
    // dit_team: get(req, 'session.user.dit_team.id'),
  }
  const mergedPropositionData = pickBy(merge({}, propositionDefaults, propositionData, res.locals.requestBody))
  const propositionId = get(res.locals, 'proposition.id')
  const propositionForm =
    buildFormWithStateAndErrors(
      formConfigs[req.params.kind](
        assign({}, res.locals.options, res.locals.conditions, {
          returnLink: propositionId ? `/propositions/${propositionId}` : res.locals.returnLink,
          returnText: propositionId ? 'Return without saving' : 'Cancel',
          buttonText: propositionId ? 'Save and return' : `Add ${lowerCase(req.params.kind)}`,
          hiddenFields: {
            id: propositionId,
            // company: res.locals.company.id,
            investment_project: get(res.locals, 'investmentData.id'),
            // kind: snakeCase(req.params.kind),
          },
        })),
      mergedPropositionData,
      get(res.locals, 'form.errors.messages'),
    )

  const forEntityName = res.locals.entityName ? ` for ${res.locals.entityName}` : ''
  const kindName = lowerCase(req.params.kind)
  const actionName = (propositionData ? 'Edit' : 'Add')

  res
    .breadcrumb(`${actionName} ${kindName}`)
    .title(`${actionName} ${kindName + forEntityName}`)
    .render('propositions/views/edit', {
      propositionForm,
    })
}

module.exports = {
  renderEditPage,
}
