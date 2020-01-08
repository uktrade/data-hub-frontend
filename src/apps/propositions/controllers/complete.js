/* eslint camelcase: 0 */
const { assign, get } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { completeForm } = require('../macros')

function renderComplete(req, res) {
  const { proposition, investment } = res.locals

  const selectCompleteForm = buildFormWithStateAndErrors(
    completeForm(
      assign({}, res.locals.options, res.locals.conditions, {
        returnLink: res.locals.returnLink,
        returnText: 'Cancel',
        hiddenFields: {
          id: proposition.id,
          investment_project: investment.id,
        },
      })
    ),
    proposition,
    get(res.locals, 'form.errors.messages')
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
