const maxemailEmailSentQuery = require('./maxemail-email-sent-query')
const maxemailCampaignQuery = require('./maxemail-campaign-query')
const externalActivityQuery = require('./external-activity-query')
const dataHubActivityQuery = require('./data-hub-activity-query')
const myActivityQuery = require('./my-activity-query')
const aventriAttendeeForCompanyQuery = require('./aventri-attendee-for-company-query')
const dataHubAndActivityStreamServicesQuery = require('./data-hub-and-activity-stream-services-query')
const aventriAttendeeQuery = require('./aventri-attendee-query')
const exportSupportServiceQuery = require('./export-support-service-query')
const aventriAttendeeRegistrationStatusQuery = require('./aventri-attendee-registration-status-query')

module.exports = {
  myActivityQuery,
  dataHubActivityQuery,
  externalActivityQuery,
  maxemailCampaignQuery,
  maxemailEmailSentQuery,
  aventriAttendeeForCompanyQuery,
  dataHubAndActivityStreamServicesQuery,
  aventriAttendeeQuery,
  exportSupportServiceQuery,
  aventriAttendeeRegistrationStatusQuery,
}
