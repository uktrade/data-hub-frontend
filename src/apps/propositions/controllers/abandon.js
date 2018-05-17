/* eslint camelcase: 0 */
const { assign, get } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { abandonForm } = require('../macros')

function renderAbandon (req, res) {
  console.log('~~~~~~~~~~~~ renderAbandon ~~~~~~~~~~~ ', res.locals.returnLink )

  // const token = req.session.token
  // const investmentId = get(res.locals, 'investmentData.id')

  const proposition = get(res.locals, 'proposition')
  const propositionId = get(res.locals, 'proposition.id')
  const investment_project = get(res.locals, 'investmentData.id')

  const selectAbandonForm = buildFormWithStateAndErrors(abandonForm(
    assign({}, res.locals.options, res.locals.conditions, {
      hiddenFields: {
        id: propositionId,
        investment_project,
      },
    })),
  proposition,
  get(res.locals, 'form.errors.messages'),
  )

  res
    .breadcrumb('Abandon Proposition')
    .title(proposition.name)
    .render('propositions/views/abandon.njk', {
      selectAbandonForm,
    })
}

module.exports = {
  renderAbandon,
  // postAbandon,
}
