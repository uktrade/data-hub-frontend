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

  const metadata = [
    {
      label: 'Submitted to EYB',
      value: formatDate(triage_created, DATE_FORMAT_COMPACT),
    },
    { label: 'Estimated spend', value: spend },
    { label: 'Sector', value: sector ? sector.name : '' },
    {
      label: 'Estimated land date',
      value: convertEYBChoicesToLabels(landing_timeframe),
    },
    {
      label: 'Location',
      value: proposed_investment_region ? proposed_investment_region.name : '',
    },
  ].filter((metadata) => metadata.value)

  return {
    id,
    headingUrl: urls.investments.eybLeads.details(id),
    headingText: company ? company.name : company_name,
    tags,
    metadata,
  }
}
