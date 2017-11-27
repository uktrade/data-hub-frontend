const { get } = require('lodash')

async function renderDocuments (req, res, next) {
  const archivedDocumentPath = get(res.locals, 'investmentData.archived_documents_url_path')

  return res
    .breadcrumb('Documents')
    .render('investment-projects/views/documents', {
      archivedDocumentPath,
    })
}

module.exports = {
  renderDocuments,
}
