const maxemailEmailSentQuery = require('./maxemail-email-sent-query')
const maxemailCampaignQuery = require('./maxemail-campaign-query')
const externalActivityQuery = require('./external-activity-query')
const dataHubActivityQuery = require('./data-hub-activity-query')
const myActivityQuery = require('./my-activity-query')
const aventriAttendeeForCompanyQuery = require('./aventri-attendee-for-company-query')
const dataHubAndAventriActivityQuery = require('./data-hub-and-aventri-activity-query')
const aventriAttendeeQuery = require('./aventri-attendee-query')
const aventriAttendeeRegistrationStatusQuery = require('./aventri-attendee-registration-status-query')

module.exports = {
  myActivityQuery,
  dataHubActivityQuery,
  externalActivityQuery,
  maxemailCampaignQuery,
  maxemailEmailSentQuery,
  aventriAttendeeForCompanyQuery,
  dataHubAndAventriActivityQuery,
  aventriAttendeeQuery,
  aventriAttendeeRegistrationStatusQuery,
}
