/* eslint camelcase: 0 */
const { assign, get } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { uploadForm } = require('../macros')

function renderUpload (req, res) {
  // TODO(jf) this is where you pass the config info, and should be unique for each module
  const proposition = get(res.locals, 'proposition')
  const propositionId = get(res.locals, 'proposition.id')
  const investment_project = get(res.locals, 'investmentData.id')

  const selectUploadForm = buildFormWithStateAndErrors(uploadForm(
    assign({}, res.locals.options, res.locals.conditions, {
      returnLink: res.locals.returnLink,
      hiddenFields: {
        id: propositionId,
        proposition_id: propositionId,
        investment_project,
      },
    })),
  proposition,
  get(res.locals, 'form.errors.messages'),
  )

  res
    .breadcrumb('Choose files')
    .title('Choose files')
    .render('propositions/views/upload.njk', {
      selectUploadForm,
    })
}

module.exports = {
  renderUpload,
}
