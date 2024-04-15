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
    heading="sent"
    shouldPluralize={false}
    noResults="You don't have any sent export wins."
    // We have to send null as a string otherwise
    // it's stripped out of the payload by Axois
    payload={{ confirmed: String(WIN_STATUS.SENT) }}
  >
    {(page) => (
      <ul>
        {page.map((item) => (
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
                  // needs to take a JSX element
                  value: item.company_contacts[0].name,
                },
                {
                  label: 'Total value: ',
                  value: currencyGBP(item.total_expected_export_value),
                },
                { label: 'Date won: ', value: formatMediumDate(item.date) },
                {
                  label: 'Date modified: ',
                  value: formatMediumDate(item.modified_on),
                },
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
