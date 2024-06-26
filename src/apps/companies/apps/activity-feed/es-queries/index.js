const dataHubActivityQuery = require('./data-hub-activity-query')
const myActivityQuery = require('./my-activity-query')
const aventriAttendeeQuery = require('./aventri-attendee-query')
const exportSupportServiceDetailQuery = require('./export-support-service-detail-query')
const aventriAttendeeRegistrationStatusQuery = require('./aventri-attendee-registration-status-query')

module.exports = {
  myActivityQuery,
  dataHubActivityQuery,
  aventriAttendeeQuery,
  exportSupportServiceDetailQuery,
  aventriAttendeeRegistrationStatusQuery,
}
