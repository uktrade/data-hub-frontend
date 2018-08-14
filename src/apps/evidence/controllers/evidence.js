/* eslint camelcase: 0 */
const { assign, get } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { transformEvidenceResponseToForm } = require('../transformers')
const { evidenceForm } = require('../macros')

function renderAddEvidence (req, res) {
  //const evidenceData = transformEvidenceResponseToForm(res.locals.evidence)
  const investment = get(res.locals, 'investmentData.id')
  const evidence = get(res.locals, 'evidence.id')

  const addEvidenceForm = buildFormWithStateAndErrors(evidenceForm(
    assign({}, res.locals.options, res.locals.conditions, {
      returnLink: res.locals.returnLink,
      returnText: 'Cancel',
      buttonText: 'Add evidence',

      /**
       * Order and names of hidden inputs are important because we rely on them to build the API call url
       * - names need to match the API keys
       * - values need to match the ID of the app or subb-app in scope
       */
      hiddenFields: {
        investment,
        // evidence_group,
      },
    })),
  get(res.locals, 'form.errors.messages'),
  )

  res
    .breadcrumb('Choose files')
    .title('Choose files')
    .render('evidence/views/evidence-add-new.njk', {
      addEvidenceForm,
    })
}

module.exports = {
  renderAddEvidence,
}
