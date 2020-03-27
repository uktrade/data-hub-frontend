const { get } = require('lodash')

async function renderDocuments(req, res) {
  const archivedDocumentPath = get(
    res.locals,
    'investment.archived_documents_url_path'
  )

  return res.breadcrumb('Documents').render('investments/views/documents', {
    archivedDocumentPath,
  })
}

module.exports = {
  renderDocuments,
}
