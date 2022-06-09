function renderDocuments(req, res) {
  const contactId = req.params.contactId
  const contact = res.locals.contact
  const isContactActivitiesFeatureOn = res.locals.userFeatures?.includes(
    'user-contact-activities'
  )
  const { ARCHIVED_DOCUMENT_BASE_URL } = res.locals

  return res.breadcrumb('Documents').render('contacts/views/documents', {
    props: {
      contactId: contactId,
      contact: contact,
      isContactActivitiesFeatureOn,
      archivedDocumentPath: ARCHIVED_DOCUMENT_BASE_URL,
    },
    isContactActivitiesFeatureOn,
  })
}

module.exports = {
  renderDocuments,
}
