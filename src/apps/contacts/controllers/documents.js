const { get } = require('lodash')

function renderDocuments(req, res) {
  const archivedDocumentPath = get(
    res.locals,
    'contact.archived_documents_url_path'
  )

  return res.breadcrumb('Documents').render('contacts/views/documents', {
    archivedDocumentPath,
  })
}

module.exports = {
  renderDocuments,
}
