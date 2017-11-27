const { get } = require('lodash')

async function renderDocuments (req, res, next) {
  const archivedDocumentPath = get(res.locals, 'contact.archived_documents_url_path')

  return res
    .breadcrumb('Documents')
    .render('contacts/views/documents', {
      archivedDocumentPath,
    })
}

module.exports = {
  renderDocuments,
}
