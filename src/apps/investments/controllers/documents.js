async function renderDocuments(req, res) {
  const { id } = res.locals.investment
  const { ARCHIVED_DOCUMENT_BASE_URL } = res.locals

  return res.breadcrumb('Documents').render('investments/views/documents', {
    props: {
      projectId: id,
      archivedDocumentPath: ARCHIVED_DOCUMENT_BASE_URL,
    },
  })
}

module.exports = {
  renderDocuments,
}
