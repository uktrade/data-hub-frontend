const { get, isUndefined } = require('lodash')

function renderDocuments (req, res, next) {
  const archivedDocumentPath = get(res.locals, 'contact.archived_documents_url_path')

  if (isUndefined(archivedDocumentPath)) {
    return next({ statusCode: 403 })
  }

  return res
    .breadcrumb('Documents')
    .render('contacts/views/documents', {
      archivedDocumentPath,
    })
}

module.exports = {
  renderDocuments,
}
