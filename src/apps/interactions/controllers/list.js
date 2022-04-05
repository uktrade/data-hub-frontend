const path = require('path')
const { get, set } = require('lodash')
const { getOptions } = require('../../../lib/options')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { transformAdviserToOption } = require('../../adviser/transformers')
const { saveSession } = require('../../../lib/session-helper')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')

const QUERY_STRING = FILTER_CONSTANTS.INTERACTIONS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INTERACTIONS.SECTOR.NAME

const filterServiceNames = (services) => {
  if (!services) return

  const excludedServiceStrings = [
    'A Specific DIT Export Service or Funding',
    'A Specific Service',
    'Enquiry or Referral Received',
    'Enquiry Received',
  ]

  const filteredServiceNames = services
    .map((service) => {
      const splitServiceName = service.label.split(' : ')
      const name =
        splitServiceName[1] &&
        excludedServiceStrings.includes(splitServiceName[0])
          ? splitServiceName[1]
          : service.label
      return { ...service, label: name }
    })
    .sort(function (a, b) {
      const textA = a.label
      const textB = b.label

      return textA.localeCompare(textB)
    })

  return filteredServiceNames
}

async function getInteractionOptions(req, res) {
  if (req.xhr && get(req.session, 'interactions.options')) {
    return req.session.interactions.options
  }
  const sectorOptions = await getOptions(req, SECTOR, {
    queryString: QUERY_STRING,
  })

  const unfilteredServiceOptions = await getOptions(req, 'service', {
    includeDisabled: true,
  })

  const serviceOptions = filterServiceNames(unfilteredServiceOptions)

  const teamOptions = await getOptions(req, 'team', { includeDisabled: true })
  const types = await getOptions(req, 'policy-issue-type')

  const areas = await getOptions(req, 'policy-area')
  const oneListTierOptions = await getOptions(req, 'one-list-tier')

  const currentAdvisers =
    get(res.locals, 'interaction.dit_participants') &&
    res.locals.interaction.dit_participants.map(
      (participant) => participant.adviser && participant.adviser.id
    )

  const advisers = await getAdvisers(req)

  const activeAdvisers = filterActiveAdvisers({
    advisers: advisers.results,
    includeAdviser: currentAdvisers,
  })

  const adviserOptions = activeAdvisers.map(transformAdviserToOption)

  const interactionOptions = {
    areas,
    sectorOptions,
    serviceOptions,
    teamOptions,
    adviserOptions,
    oneListTierOptions,
    types,
  }

  set(req.session, 'interactions.options', interactionOptions)
  await saveSession(req.session)

  return interactionOptions
}

function renderInteractionsForEntity(req, res, next) {
  try {
    const {
      view,
      returnLink,
      createKind,
      canAdd,
      theme = '',
      contactId,
    } = res.locals.interactions

    const isContactActivitiesFeatureOn = res.locals.userFeatures?.includes(
      'user-contact-activities'
    )

    const breadcrumbTitle = isContactActivitiesFeatureOn
      ? 'Activity'
      : 'Interactions'

    const actionButtons = canAdd
      ? [
          {
            label: 'Add interaction',
            url: path.join(
              returnLink,
              '/create',
              createKind ? `/${theme}/${createKind}` : ''
            ),
          },
        ]
      : undefined

    res.breadcrumb(breadcrumbTitle).render(view, {
      actionButtons,
      props: {
        contactId: contactId,
      },
      isContactActivitiesFeatureOn,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionsForEntity,
  getInteractionOptions,
}
