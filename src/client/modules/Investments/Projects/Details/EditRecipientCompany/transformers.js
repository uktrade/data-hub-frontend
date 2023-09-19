import { get } from 'lodash'

import urls from '../../../../../../lib/urls'
import labels from '../../../../Companies/CollectionList/labels'
import { addressToString } from '../../../../../utils/addresses'
import { format, formatMediumDateTime } from '../../../../../utils/date'

export const checkIfRecipientCompanyExists = (hasRecipientCompany) =>
  hasRecipientCompany ? 'Update recipient company' : 'Add recipient company'

const transformCompanyToListItem =
  (projectId) =>
  ({
    id,
    name,
    sector,
    uk_region,
    trading_names,
    address,
    modified_on,
    headquarter_type,
    global_headquarters,
    latest_interaction_date,
  } = {}) => {
    const metadata = [
      {
        label: 'Sector',
        value: get(sector, 'name'),
      },
      {
        label: 'Global HQ',
        value: get(global_headquarters, 'name'),
      },
      {
        label: labels.address.companyAddress,
        value: addressToString(address),
      },
    ]

    if (trading_names && trading_names.length) {
      metadata.push({
        label: labels.hqLabels.trading_names,
        value: trading_names.join(', '),
      })
    }

    if (latest_interaction_date) {
      metadata.push({
        label: 'Last interaction date',
        value: format(latest_interaction_date),
      })
    }

    if (headquarter_type) {
      metadata.push({
        label: 'Headquarter type',
        value: labels.hqLabels[get(headquarter_type, 'name')],
      })
    }

    const badges = [
      { text: get(address, 'country.name') },
      { text: get(uk_region, 'name') },
      { text: labels.hqLabels[get(headquarter_type, 'name')] },
    ].filter((item) => item.text)

    return {
      id,
      subheading: modified_on
        ? `Updated on ${formatMediumDateTime(modified_on)}`
        : undefined,
      headingText: name,
      headingUrl: urls.investments.projects.editRecipientCompany(projectId, id),
      badges,
      metadata: metadata.filter((item) => item.value),
    }
  }

export const transformResponseToCompanyCollection = (
  projectId,
  { count, results = [] }
) => ({
  count,
  results: results.map(transformCompanyToListItem(projectId)),
})
