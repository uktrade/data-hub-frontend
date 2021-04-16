const {
  FILTER_ITEMS,
  FILTER_KEYS,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
} = require('./constants')

const { getGlobalUltimateHierarchy } = require('../../repos')
const urls = require('../../../../lib/urls')
const { fetchActivityFeed } = require('./repos')
const config = require('../../../../config')

const {
  myActivityQuery,
  dataHubActivityQuery,
  externalActivityQuery,
  maxemailCampaignQuery,
  maxemailEmailSentQuery,
} = require('./es-queries')

async function renderActivityFeed(req, res, next) {
  const {
    company,
    features,
    dnbHierarchyCount,
    dnbRelatedCompaniesCount,
  } = res.locals

  res.locals.title = `Activities - ${company.name} - Companies`

  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    { link: urls.companies.index(), text: 'Companies' },
    { link: urls.companies.detail(company.id), text: company.name },
    { text: 'Activity Feed' },
  ]

  try {
    const contentProps = company.archived
      ? {
          company,
          breadcrumbs,
          flashMessages: res.locals.getMessages(),
        }
      : {
          company,
          breadcrumbs,
          hasActivityFeedWarning: !!res.locals.features[
            'activity-feed-display-incomplete-message'
          ],
          flashMessages: res.locals.getMessages(),
          activityTypeFilter: FILTER_KEYS.dataHubActivity,
          activityTypeFilters: FILTER_ITEMS,
          isGlobalUltimate: company.is_global_ultimate,
          dnbHierarchyCount,
          dnbRelatedCompaniesCount,
          isTypeFilterFlagEnabled:
            features['activity-feed-type-filter-enabled'],
          isGlobalUltimateFlagEnabled: features['companies-ultimate-hq'],
          showMatchingPrompt:
            features['companies-matching'] &&
            !company.duns_number &&
            !company.pending_dnb_investigation,
        }

    const props = {
      ...contentProps,
      apiEndpoint: urls.companies.activity.data(company.id),
    }

    res.render('companies/apps/activity-feed/views/client-container', { props })
  } catch (error) {
    next(error)
  }
}

function getQueries(options, isExportEnquiriesEnabled) {
  return {
    [FILTER_KEYS.myActivity]: myActivityQuery({
      ...options,
      types: DATA_HUB_ACTIVITY,
    }),
    [FILTER_KEYS.dataHubActivity]: dataHubActivityQuery({
      ...options,
      types: DATA_HUB_ACTIVITY,
    }),
    [FILTER_KEYS.externalActivity]: externalActivityQuery(
      {
        ...options,
        types: EXTERNAL_ACTIVITY,
      },
      isExportEnquiriesEnabled
    ),
    [FILTER_KEYS.dataHubAndExternalActivity]: externalActivityQuery(
      {
        ...options,
        types: DATA_HUB_AND_EXTERNAL_ACTIVITY,
      },
      isExportEnquiriesEnabled
    ),
  }
}

function isExternalFilter(activityTypeFilter) {
  return (
    activityTypeFilter === FILTER_KEYS.externalActivity ||
    activityTypeFilter === FILTER_KEYS.dataHubAndExternalActivity
  )
}

function getContactFromEmailAddress(emailAddress, contacts) {
  const contact = contacts.find((contact) => contact.email === emailAddress)
  return contact
    ? {
        ...contact,
        url: urls.contacts.details(contact.id),
      }
    : null
}

async function getMaxemailCampaigns(req, next, contacts) {
  try {
    // Fetch Maxemail campaigns
    const campaignQuery = maxemailCampaignQuery()
    const campaignsResults = await fetchActivityFeed(req, campaignQuery)
    const campaignActivities = campaignsResults.hits.hits.map(
      (hit) => hit._source
    )

    // Fetch all Maxemail emails sent to Data Hub company contacts as part of a campaign
    const emailSentQuery = maxemailEmailSentQuery(contacts)
    const emailSentResults = await fetchActivityFeed(req, emailSentQuery)
    const emailSentActivities = emailSentResults.hits.hits.map(
      (hit) => hit._source
    )

    // Group Data Hub company contacts to a campaign
    campaignActivities.forEach((campaign) => {
      campaign.object.contacts = []
      const campaignId = campaign.object['dit:maxemail:Campaign:id']
      emailSentActivities.forEach((emailSent) => {
        const sentEmailCampaignId =
          emailSent.object.attributedTo['dit:maxemail:Campaign:id']
        if (campaignId === sentEmailCampaignId) {
          const emailAddress = emailSent.object['dit:emailAddress']
          const contact = getContactFromEmailAddress(emailAddress, contacts)
          if (contact) {
            campaign.object.contacts.push(contact)
          }
        }
      })
    })

    // We only want campaigns that have at least one contact
    return campaignActivities.filter(
      (campaign) => campaign.object.contacts.length
    )
  } catch (error) {
    next(error)
  }
}

async function fetchActivityFeedHandler(req, res, next) {
  try {
    const { company, user, features } = res.locals
    const {
      from = 0,
      size = config.activityFeed.paginationSize,
      activityTypeFilter = FILTER_KEYS.dataHubActivity,
      showDnbHierarchy = false,
    } = req.query

    let dnbHierarchyIds = []
    if (company.is_global_ultimate && showDnbHierarchy) {
      const { results } = await getGlobalUltimateHierarchy(
        req,
        company.global_ultimate_duns_number
      )
      dnbHierarchyIds = results
        .filter((company) => !company.is_global_ultimate)
        .map((company) => company.id)
    }

    const queries = getQueries(
      {
        from,
        size,
        companyIds: [company.id, ...dnbHierarchyIds],
        contacts: company.contacts,
        user,
      },
      features['activity-feed-export-enquiry']
    )

    const results = await fetchActivityFeed(
      req,
      queries[activityTypeFilter] || queries[FILTER_KEYS.dataHubActivity]
    )

    let activities = results.hits.hits.map((hit) => hit._source)
    let total = results.hits.total.value

    const isMaxemailEnabled = features['activity-feed-maxemail-campaign']
    if (isExternalFilter(activityTypeFilter) && isMaxemailEnabled) {
      const campaigns = await getMaxemailCampaigns(req, next, company.contacts)
      activities = [...activities, ...campaigns]
      total += campaigns.length
    }

    res.json({
      total,
      activities,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderActivityFeed,
  fetchActivityFeedHandler,
}
