import urls from '../../../../lib/urls'
import { format } from '../../../utils/date'

export const transformLeadToListItem = ({
  id,
  company,
  company_name,
  triage_created,
  spend,
  sector,
  landing_timeframe,
  address_country,
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
    { label: 'Location', value: address_country ? address_country.name : '' },
  ].filter((metadata) => metadata.value)

  return {
    id,
    headingUrl: urls.investments.eybLeads.details(id),
    headingText: company ? company.name : company_name,
    tags,
    metadata,
  }
}
