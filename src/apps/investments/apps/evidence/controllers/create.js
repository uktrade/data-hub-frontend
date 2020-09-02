/* eslint camelcase: 0 */
const { assign, get } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../../../builders')
const { getOptions } = require('../../../../../lib/options')
const { evidenceForm } = require('../macros/index')

async function renderAddEvidence(req, res) {
  const investment = get(res.locals, 'investment.id')
  const tags = await getOptions(req, 'evidence-tag')

  const addEvidenceForm = buildFormWithStateAndErrors(
    evidenceForm(
      assign({}, res.locals.options, res.locals.conditions, {
        returnLink: res.locals.returnLink,
        returnText: 'Cancel',
        buttonText: 'Upload',
        tags,
        hiddenFields: {
          investment,
        },
      })
    ),
    get(res.locals, 'form.errors.messages')
  )

  res
    .breadcrumb('Add evidence')
    .title('Add evidence')
    .render('investments/apps/evidence/views/create', {
      addEvidenceForm,
    })
}

module.exports = {
  renderAddEvidence,
}
