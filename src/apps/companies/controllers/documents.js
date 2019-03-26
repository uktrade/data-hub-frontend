function renderDocuments (req, res) {
  const { company } = res.locals

  return res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Documents')
    .render('companies/views/documents', {
      archivedDocumentPath: company.archived_documents_url_path,
    })
}

module.exports = {
  renderDocuments,
}
