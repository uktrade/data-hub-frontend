import urls from '../../../../lib/urls'
import { format } from '../../../utils/date'

export const transformLeadToListItem = ({
  id,
  company,
  triage_created,
  spend,
  sector,
  landing_timeframe,
  location,
  is_high_value,
}) => {
  const tags = [
    {
      text: is_high_value ? 'HIGH VALUE' : 'LOW VALUE',
      colour: is_high_value ? 'green' : 'orange',
      dataTest: 'value-label',
    },
  ]

  const metadata = [
    {
      label: 'Submitted to EYB',
      value: format(triage_created, 'dd MMM yyyy'),
    },
    { label: 'Estimated spend', value: spend },
    { label: 'Sector', value: sector ? sector.name : '' },
    { label: 'Estimated land date', value: landing_timeframe },
    { label: 'Location', value: location ? location.name : '' },
  ].filter((metadata) => metadata.value)

  return {
    id,
    headingUrl: urls.investments.eybLeads.details(id),
    headingText: company.name,
    tags,
    metadata,
  }
}
