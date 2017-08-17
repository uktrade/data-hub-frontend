const EditAssigneesController = require('./assignees')
const EditClientDetailsController = require('./client-details')
const EditSubscribersController = require('./subscribers')
const EditWorkDescriptionController = require('./work-description')
const editHandler = require('./edit-handler')
const editRedirect = require('./edit-redirect')

module.exports = {
  EditAssigneesController,
  EditClientDetailsController,
  EditSubscribersController,
  EditWorkDescriptionController,
  editHandler,
  editRedirect,
}
