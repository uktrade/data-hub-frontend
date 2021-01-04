const maxemailEmailSentQuery = require('./maxemail-email-sent-query')
const maxemailCampaignQuery = require('./maxemail-campaign-query')
const externalActivityQuery = require('./external-activity-query')
const dataHubActivityQuery = require('./data-hub-activity-query')
const myActivityQuery = require('./my-activity-query')

module.exports = {
  myActivityQuery,
  dataHubActivityQuery,
  externalActivityQuery,
  maxemailCampaignQuery,
  maxemailEmailSentQuery,
}
