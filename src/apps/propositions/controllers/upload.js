const { assign, get } = require('lodash')
const { buildFormWithStateAndErrors } = require('../../builders')
const { uploadForm } = require('../macros')

function renderUpload(req, res, next) {
  const proposition = get(res.locals, 'proposition.id')
  const investment = get(res.locals, 'investment.id')
  const selectUploadForm = buildFormWithStateAndErrors(
    uploadForm(
      assign({}, res.locals.options, res.locals.conditions, {
        returnLink: res.locals.returnLink,
        hiddenFields: {
          investment,
          proposition,
        },
      })
    ),
    get(res.locals, 'form.errors.messages')
  )

  res
    .breadcrumb('Choose files')
    .title('Choose files')
    .render('propositions/views/upload', {
      selectUploadForm,
    })
}

module.exports = {
  renderUpload,
}
