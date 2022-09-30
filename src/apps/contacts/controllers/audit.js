const {
  ACTIVITY_STREAM_FEATURE_FLAG,
} = require('../../companies/apps/activity-feed/constants')

async function getAudit(req, res, next) {
  try {
    const contactId = req.params.contactId
    const contact = res.locals?.contact

    const isActivityStreamFeatureFlagEnabled =
      res.locals?.userFeatures?.includes(ACTIVITY_STREAM_FEATURE_FLAG)

    return res.breadcrumb('Audit history').render('contacts/views/audit', {
      props: {
        contactId: contactId,
        contact: contact,
        isActivityStreamFeatureFlagEnabled,
      },
      isActivityStreamFeatureFlagEnabled,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAudit,
}
