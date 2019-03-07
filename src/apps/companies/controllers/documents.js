function renderDocuments (req, res) {
  const { company, features } = res.locals
  const view = (company.duns_number || features['companies-new-layout'])
    ? 'companies/views/documents'
    : 'companies/views/_deprecated/documents'

  return res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Documents')
    .render(view, {
      archivedDocumentPath: company.archived_documents_url_path,
    })
}

module.exports = {
  renderDocuments,
}
