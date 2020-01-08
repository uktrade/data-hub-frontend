/* eslint camelcase: 0 */
const { assign, get } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { abandonForm } = require('../macros')

function renderAbandon(req, res) {
  const proposition = get(res.locals, 'proposition')
  const propositionId = get(res.locals, 'proposition.id')
  const investment_project = get(res.locals, 'investment.id')

  const selectAbandonForm = buildFormWithStateAndErrors(
    abandonForm(
      assign({}, res.locals.options, res.locals.conditions, {
        returnLink: res.locals.returnLink,
        returnText: 'Cancel',
        hiddenFields: {
          id: propositionId,
          investment_project,
        },
      })
    ),
    proposition,
    get(res.locals, 'form.errors.messages')
  )

  res
    .breadcrumb('Abandon Proposition')
    .title(`Abandon proposition ${proposition.name}`)
    .render('propositions/views/abandon.njk', {
      selectAbandonForm,
    })
}

module.exports = {
  renderAbandon,
}
