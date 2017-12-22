const { get, isUndefined } = require('lodash')

function renderDocuments (req, res, next) {
  const { id: companyId, name: companyName } = get(res.locals, 'company')
  const archivedDocumentPath = get(res.locals, 'company.archived_documents_url_path')

  if (isUndefined(archivedDocumentPath)) {
    return next({ statusCode: 403 })
  }

  return res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb('Documents')
    .render('companies/views/documents', {
      archivedDocumentPath,
    })
}

module.exports = {
  renderDocuments,
}
