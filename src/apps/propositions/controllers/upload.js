/* eslint camelcase: 0 */
const { assign, get } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { uploadForm } = require('../macros')

function renderUpload (req, res) {
  const proposition = get(res.locals, 'proposition')
  const propositionId = get(res.locals, 'proposition.id')
  const investment_project = get(res.locals, 'investmentData.id')

  const selectUploadForm = buildFormWithStateAndErrors(uploadForm(
    assign({}, res.locals.options, res.locals.conditions, {
      returnLink: res.locals.returnLink,
      hiddenFields: {
        id: propositionId,
        investment_project,
      },
    })),
  proposition,
  get(res.locals, 'form.errors.messages'),
  )

  res
    .breadcrumb('Upload Proposition Document')
    .title('Upload proposition document')
    .render('propositions/views/upload.njk', {
      selectUploadForm,
    })
}

module.exports = {
  renderUpload,
}
