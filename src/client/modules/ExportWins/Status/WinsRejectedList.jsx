import React from 'react'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate } from '../../../utils/date'
import { CollectionItem } from '../../../components'
import { sumExportValues } from './utils'
import { WIN_STATUS } from './constants'
import urls from '../../../../lib/urls'

export const WinsRejectedList = ({ exportWins }) => {
  return exportWins.length === 0 ? null : (
    <ul>
      {exportWins.map((item) => (
        <li key={item.id}>
          <CollectionItem
            headingText={`${item.name_of_export} to ${item?.country?.name}`}
            headingUrl={urls.companies.exportWins.editSummary(
              item.company.id,
              item.id
            )}
            subheading={item.company.name}
            subheadingUrl={urls.companies.overview.index(item.company.id)}
            metadata={[
              {
                label: 'Contact name:',
                // TODO: This needs to be a link, the MetadataItem
                // needs to take a JSX element as a parameter.
                value: item.company_contacts[0].name,
              },
              {
                label: 'Total value:',
                value: currencyGBP(sumExportValues(item)),
              },
              { label: 'Date won:', value: formatMediumDate(item.date) },
              {
                label: 'Date modified:',
                value: formatMediumDate(item.modified_on),
              },
            ]}
          />
        </li>
      ))}
    </ul>
  )
}

export default () => (
  <ExportWinsResource.Paginated
    id="export-wins-rejected"
    heading="rejected"
    shouldPluralize={false}
    noResults="You don't have any rejected export wins."
    payload={{ confirmed: WIN_STATUS.REJECTED }}
  >
    {(page) => <WinsRejectedList exportWins={page} />}
  </ExportWinsResource.Paginated>
)
