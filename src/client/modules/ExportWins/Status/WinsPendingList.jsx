import React from 'react'
import Link from '@govuk-react/link'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate, formatMediumDateTime } from '../../../utils/date'
import { CollectionItem } from '../../../components'
import { sumExportValues } from './utils'
import { SORT_OPTIONS, WIN_STATUS } from './constants'
import urls from '../../../../lib/urls'

export const WinsPendingList = ({ exportWins = [] }) => {
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
            ...(item.company_contacts[0]
              ? [
                  {
                    label: 'Contact name:',
                    value: (
                      <Link
                        href={urls.contacts.details(
                          item.company_contacts[0].id
                        )}
                      >
                        {item.company_contacts[0].name}
                      </Link>
                    ),
                  },
                ]
              : []),
            {
              label: 'Total value:',
              value: currencyGBP(sumExportValues(item)),
            },
            { label: 'Date won:', value: formatMediumDate(item.date) },
            {
              label: 'Date modified:',
              value: formatMediumDate(item.modified_on),
            },
            {
              label: 'First sent:',
              value: formatMediumDateTime(item.first_sent),
            },
            {
              label: 'Last sent:',
              value: formatMediumDateTime(item.last_sent),
            },
          ]}
        />
      ))}
    </ul>
  )
}

export default () => (
  <ExportWinsResource.Paginated
    id="export-wins-pending"
    heading="pending"
    shouldPluralize={false}
    noResults="You don't have any pending export wins."
    // We have to send null as a string otherwise
    // it's stripped out of the payload by Axios
    payload={{
      confirmed: String(WIN_STATUS.PENDING),
    }}
    sortOptions={SORT_OPTIONS}
  >
    {(page) => <WinsPendingList exportWins={page} />}
  </ExportWinsResource.Paginated>
)
