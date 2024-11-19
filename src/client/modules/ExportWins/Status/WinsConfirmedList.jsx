import React from 'react'
import Link from '@govuk-react/link'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDateParsed } from '../../../utils/date'
import { CollectionItem } from '../../../components'
import { sumExportValues, createRoleTags } from './utils'
import { SORT_OPTIONS, WIN_STATUS } from './constants'
import State from '../../../components/State'
import urls from '../../../../lib/urls'

export const WinsConfirmedList = ({ exportWins = [], currentAdviserId }) => {
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
            {
              label: 'Date won:',
              value: formatMediumDateParsed(item.date),
            },
            {
              label: 'Date responded:',
              value: item.customer_response.responded_on
                ? formatMediumDateParsed(item.customer_response?.responded_on)
                : '',
            },
          ]}
        />
      ))}
    </ul>
  )
}

export default () => (
  <ExportWinsResource.Paginated
    id="export-wins-confirmed"
    heading="confirmed"
    shouldPluralize={false}
    noResults="You don't have any confirmed export wins."
    payload={{ confirmed: WIN_STATUS.CONFIRMED }}
    sortOptions={SORT_OPTIONS}
  >
    {(page) => (
      <State>
        {({ currentAdviserId }) => (
          <WinsConfirmedList
            exportWins={page}
            currentAdviserId={currentAdviserId}
          />
        )}
      </State>
    )}
  </ExportWinsResource.Paginated>
)
