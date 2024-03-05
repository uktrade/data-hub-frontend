import React from 'react'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate, formatMediumDateTime } from '../../../utils/date'
import { CollectionItem } from '../../../components'
import { WIN_STATUS } from './constants'
import urls from '../../../../lib/urls'

export default () => (
  <ExportWinsResource.Paginated
    id="export-wins-sent"
    noResults="You don't have any sent export wins."
    payload={{ confirmed: WIN_STATUS.SENT }}
  >
    {(page) => (
      <ul>
        {page.map((item) => (
          <li key={item.id}>
            <CollectionItem
              headingText={`${item.name_of_export} to ${item?.country?.name}`}
              headingUrl={urls.companies.exportWins.details(item.id)}
              subheading={item.company.name}
              subheadingUrl={urls.companies.overview.index(item.company.id)}
              metadata={[
                { label: 'Destination: ', value: item.country.name },
                {
                  label: 'Contact name:',
                  // TODO: This needs to be a link, the MetadataItem
                  // needs to take a JSX element
                  value: item.company_contacts[0].name,
                },
                {
                  label: 'Total value: ',
                  value: currencyGBP(item.total_expected_export_value),
                },
                { label: 'Date won: ', value: formatMediumDate(item.date) },
                {
                  label: 'First sent: ',
                  value: formatMediumDateTime(item.first_sent),
                },
                {
                  label: 'Last sent: ',
                  value: formatMediumDateTime(item.last_sent),
                },
              ]}
            />
          </li>
        ))}
      </ul>
    )}
  </ExportWinsResource.Paginated>
)
