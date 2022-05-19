const { get } = require('lodash')

function renderDocuments(req, res) {
  const contactId = req.params.contactId
  const isContactActivitiesFeatureOn = res.locals.userFeatures?.includes(
    'user-contact-activities'
  )

  const archivedDocumentPath = get(
    res.locals,
    'contact.archived_documents_url_path'
  )
  return res.breadcrumb('Documents').render('contacts/views/documents', {
    props: {
      contactId: contactId,
      isContactActivitiesFeatureOn,
    },
    archivedDocumentPath,
    isContactActivitiesFeatureOn,
  })
}

module.exports = {
  renderDocuments,
}
