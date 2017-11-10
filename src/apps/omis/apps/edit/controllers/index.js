const EditAssigneesController = require('./assignees')
const EditAssigneeTimeController = require('./assignee-time')
const EditClientDetailsController = require('./client-details')
const EditSubscribersController = require('./subscribers')
const EditQuoteDetailsController = require('./quote-details')
const editHandler = require('./edit-handler')
const editLeadAssignee = require('./edit-lead-assignee')
const editRedirect = require('./edit-redirect')

module.exports = {
  EditAssigneesController,
  EditAssigneeTimeController,
  EditClientDetailsController,
  EditSubscribersController,
  EditQuoteDetailsController,
  editHandler,
  editLeadAssignee,
  editRedirect,
}
