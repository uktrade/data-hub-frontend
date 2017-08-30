const { getContactAuditLog } = require('../repos')
const { transformApiResponseToCollection } = require('../../transformers')
const { transformAuditLogToListItem } = require('../../audit/transformers')
const { contactDetailsLabels } = require('../labels')

async function getAudit (req, res, next) {
  try {
    const token = req.session.token
    const contactId = req.params.contactId
    const page = req.query.page || 1

    const auditLog = await getContactAuditLog(token, contactId, page)
      .then(transformApiResponseToCollection(
        { entityType: 'audit' },
        transformAuditLogToListItem(contactDetailsLabels)
      ))

    return res
      .breadcrumb('Audit history')
      .render('contacts/views/audit', {
        auditLog,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAudit,
}
