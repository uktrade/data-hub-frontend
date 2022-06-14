const { getContactAuditLog } = require('../repos')
const {
  transformApiResponseToCollection,
} = require('../../../modules/api/transformers')
const { transformAuditLogToListItem } = require('../../audit/transformers')
const { contactAuditLabels } = require('../labels')
const {
  CONTACT_ACTIVITY_FEATURE_FLAG,
} = require('../../companies/apps/activity-feed/constants')

async function getAudit(req, res, next) {
  try {
    const contactId = req.params.contactId
    const contact = res.locals?.contact
    const page = req.query.page || 1

    const isContactActivitiesFeatureOn = res.locals?.userFeatures?.includes(
      CONTACT_ACTIVITY_FEATURE_FLAG
    )

    const auditLog = await getContactAuditLog(req, contactId, page).then(
      transformApiResponseToCollection(
        { entityType: 'audit', query: req.query },
        transformAuditLogToListItem(contactAuditLabels)
      )
    )

    return res.breadcrumb('Audit history').render('contacts/views/audit', {
      props: {
        contactId: contactId,
        contact: contact,
        isContactActivitiesFeatureOn,
      },
      auditLog,
      isContactActivitiesFeatureOn,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAudit,
}
