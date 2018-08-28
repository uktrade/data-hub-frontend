/* eslint camelcase: 0 */
const { assign, get } = require('lodash')
const { notFound } = require('../../../middleware/errors')

const { buildFormWithStateAndErrors } = require('../../builders')
const { uploadForm } = require('../macros')

function renderUpload (req, res, next) {
  if (!res.locals.features['proposition-documents']) {
    return notFound(req, res, next)
  }

  const proposition = get(res.locals, 'proposition.id')
  const investment = get(res.locals, 'investmentData.id')

  const selectUploadForm = buildFormWithStateAndErrors(uploadForm(
    assign({}, res.locals.options, res.locals.conditions, {
      returnLink: res.locals.returnLink,

      /**
       * Order and names of hidden inputs are important because we rely on them to build the API call url
       * - names need to match the API keys
       * - values need to match the ID of the app or subb-app in scope
       */
      hiddenFields: {
        investment,
        proposition,
      },
    })),
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
