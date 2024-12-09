import React from 'react'
import Link from '@govuk-react/link'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import {
  formatDate,
  DATE_FORMAT_MEDIUM,
  DATE_FORMAT_MONTH_ABBR_YEAR,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../utils/date-utils'

import { CollectionItem } from '../../../components'
import { sumExportValues, createRoleTags } from './utils'
import { SORT_OPTIONS, WIN_STATUS } from './constants'
import State from '../../../components/State'
import urls from '../../../../lib/urls'

export const WinsPendingList = ({ exportWins = [], currentAdviserId }) => {
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
          tags={createRoleTags(item, currentAdviserId)}
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
            {
              label: 'Date won:',
              value: formatDate(item.date, DATE_FORMAT_MONTH_ABBR_YEAR), // Dec 2024
            },
            {
              label: 'Date modified:',
              value: formatDate(item.modified_on, DATE_FORMAT_MEDIUM), // 4 Dec 2024
            },
            {
              label: 'First sent:',
              value: formatDate(item.first_sent, DATE_FORMAT_MEDIUM_WITH_TIME), // 4 Dec 2024, 3:30PM
            },
            {
              label: 'Last sent:',
              value: formatDate(item.last_sent, DATE_FORMAT_MEDIUM_WITH_TIME), // 4 Dec 2024, 3:30PM
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
    {(page) => (
      <State>
        {({ currentAdviserId }) => (
          <WinsPendingList
            exportWins={page}
            currentAdviserId={currentAdviserId}
          />
        )}
      </State>
    )}
  </ExportWinsResource.Paginated>
)
