/* eslint camelcase: 0 */
const { assign, get } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { completeForm } = require('../macros')

function renderComplete (req, res) {
  const proposition = get(res.locals, 'proposition')
  const propositionId = get(res.locals, 'proposition.id')
  const investment_project = get(res.locals, 'investmentData.id')

  const selectCompleteForm = buildFormWithStateAndErrors(completeForm(
    assign({}, res.locals.options, res.locals.conditions, {
      returnLink: res.locals.returnLink,
      returnText: 'Cancel',
      hiddenFields: {
        id: propositionId,
        investment_project,
      },
    })),
  proposition,
  get(res.locals, 'form.errors.messages'),
  )

  res
    .breadcrumb('Complete Proposition')
    .title(`Complete proposition ${proposition.name}`)
    .render('propositions/views/complete.njk', {
      selectCompleteForm,
    })
}

module.exports = {
  renderComplete,
}
