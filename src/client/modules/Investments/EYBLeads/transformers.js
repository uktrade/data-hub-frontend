import urls from '../../../../lib/urls'
import { TAG_COLOURS } from '../../../components/Tag'
import { VALUES_VALUE_TO_LABEL_MAP } from './constants'
import { formatDate, DATE_FORMAT_COMPACT } from '../../../utils/date-utils'
import { convertEYBChoicesToLabels } from '../utils'

export const transformLeadToListItem = ({
  id,
  company,
  company_name,
  triage_created,
  spend,
  sector,
  landing_timeframe,
  proposed_investment_region,
  is_high_value,
  audit_log,
  address,
}) => {
  const tags = [
    {
      text: VALUES_VALUE_TO_LABEL_MAP[is_high_value].toUpperCase(),
      colour: is_high_value
        ? TAG_COLOURS.GREEN
        : is_high_value === false
          ? TAG_COLOURS.ORANGE
          : TAG_COLOURS.GREY,
      dataTest: 'value-label',
    },
  ]

  const getLowHighValueAuditLog = (auditLog) => {
    return (
      auditLog?.filter?.((entry) =>
        entry.changes?.hasOwnProperty('is_high_value')
      ) || []
    )
  }

  const getLatestIsHighValueChange = (auditLog) => {
    const highValueChanges = getLowHighValueAuditLog(auditLog).filter(
      (entry) =>
        entry.changes.is_high_value[0] !== null &&
        entry.changes.is_high_value[1] !== null
    ) // Exclude null values
    if (highValueChanges.length === 0) return null

    const latestChange = highValueChanges.reduce((latest, entry) =>
      new Date(entry.timestamp) > new Date(latest.timestamp) ? entry : latest
    )

    return [
      {
        label: 'Value modified on',
        value: formatDate(latestChange.timestamp, DATE_FORMAT_COMPACT),
      },
      {
        label: 'Value change',
        value: latestChange.changes.is_high_value[0]
          ? 'High to Low'
          : 'Low to High',
      },
    ]
  }

  const metadata = [
    {
      label: 'Submitted to EYB',
      value: formatDate(triage_created, DATE_FORMAT_COMPACT),
    },
  ]

  const latestChangeMetadata = getLatestIsHighValueChange(audit_log)
  if (latestChangeMetadata) {
    metadata.push(...latestChangeMetadata)
  }

  metadata.push(
    { label: 'Estimated spend', value: spend },
    {
      label: 'Location of company headquarters',
      value: address.country.name ? address.country.name : '',
    },
    { label: 'Sector', value: sector ? sector.name : '' },
    {
      label: 'Estimated land date',
      value: convertEYBChoicesToLabels(landing_timeframe),
    },
    {
      label: 'Location',
      value: proposed_investment_region ? proposed_investment_region.name : '',
    }
  )

  // Remove any entries with falsy values
  const filteredMetadata = metadata.filter((item) => item.value)

  return {
    id,
    headingUrl: urls.investments.eybLeads.details(id),
    headingText: company ? company.name : company_name,
    tags,
    metadata: filteredMetadata,
  }
}
