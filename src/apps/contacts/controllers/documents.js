function renderDocuments(req, res) {
  const contactId = req.params.contactId
  const contact = res.locals.contact

  const { ARCHIVED_DOCUMENT_BASE_URL } = res.locals

  return res.breadcrumb('Documents').render('contacts/views/documents', {
    props: {
      contactId: contactId,
      contact: contact,

      archivedDocumentPath: ARCHIVED_DOCUMENT_BASE_URL,
    },
  })
}

module.exports = {
  renderDocuments,
}
