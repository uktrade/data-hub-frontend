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
    .render('propositions/views/upload', {
      selectUploadForm,
    })
}

function getDocumentsOptions (req, res, next) {
  res.locals.documents = {
    url: {
      app: 'investment',
      subApp: 'proposition',
    },
  }

  next()
}

module.exports = {
  getDocumentsOptions,
  renderUpload,
}
