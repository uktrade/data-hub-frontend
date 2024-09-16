import React from 'react'
import Link from '@govuk-react/link'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate } from '../../../utils/date'
import { CollectionItem } from '../../../components'
import { sumExportValues } from './utils'
import { SORT_OPTIONS, WIN_STATUS } from './constants'
import urls from '../../../../lib/urls'

export const WinsRejectedList = ({ exportWins }) => {
  return exportWins.length === 0 ? null : (
    <ul>
      {exportWins.map((item) => (
        <CollectionItem
          key={item.id}
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
              value: (
                <Link href={urls.contacts.details(item.company_contacts[0].id)}>
                  {item.company_contacts[0].name}
                </Link>
              ),
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
    sortOptions={SORT_OPTIONS}
  >
    {(page) => <WinsRejectedList exportWins={page} />}
  </ExportWinsResource.Paginated>
)
