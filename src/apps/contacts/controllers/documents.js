const {
  ACTIVITY_STREAM_FEATURE_FLAG,
} = require('../../companies/apps/activity-feed/constants')

function renderDocuments(req, res) {
  const contactId = req.params.contactId
  const contact = res.locals.contact
  const isActivitySteamFeatureFlagEnabled = res.locals.userFeatures?.includes(
    ACTIVITY_STREAM_FEATURE_FLAG
  )
  const { ARCHIVED_DOCUMENT_BASE_URL } = res.locals

  return res.breadcrumb('Documents').render('contacts/views/documents', {
    props: {
      contactId: contactId,
      contact: contact,
      isActivitySteamFeatureFlagEnabled,
      archivedDocumentPath: ARCHIVED_DOCUMENT_BASE_URL,
    },
    isActivitySteamFeatureFlagEnabled,
  })
}

module.exports = {
  renderDocuments,
}
