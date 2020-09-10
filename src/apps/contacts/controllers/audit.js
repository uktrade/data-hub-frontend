const { getContactAuditLog } = require('../repos')
const {
  transformApiResponseToCollection,
} = require('../../../modules/api/transformers')
const { transformAuditLogToListItem } = require('../../audit/transformers')
const { contactAuditLabels } = require('../labels')

async function getAudit(req, res, next) {
  try {
    const contactId = req.params.contactId
    const page = req.query.page || 1

    const auditLog = await getContactAuditLog(req, contactId, page).then(
      transformApiResponseToCollection(
        { entityType: 'audit', query: req.query },
        transformAuditLogToListItem(contactAuditLabels)
      )
    )

    return res.breadcrumb('Audit history').render('contacts/views/audit', {
      auditLog,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAudit,
}
