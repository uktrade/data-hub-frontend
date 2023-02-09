function renderDocuments(req, res) {
  const contactId = req.params.contactId

  const { ARCHIVED_DOCUMENT_BASE_URL } = res.locals

  const permissions = res.locals?.user.permissions

  return res.breadcrumb('Documents').render('contacts/views/documents', {
    props: {
      contactId,
      archivedDocumentPath: ARCHIVED_DOCUMENT_BASE_URL,
      permissions,
    },
  })
}

module.exports = {
  renderDocuments,
}
