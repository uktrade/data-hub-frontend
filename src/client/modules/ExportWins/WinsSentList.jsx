import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Button } from 'govuk-react'

import ExportWinsResource from '../../components/Resource/ExportWins'
import { currencyGBP } from '../../utils/number-utils'
import { formatMediumDate } from '../../utils/date'
import { CollectionItem } from '../../components'
import { WIN_FILTERS } from './constants'
import urls from '../../../lib/urls'

export default () => (
  <ExportWinsResource.Paginated
    id="export-wins-sent"
    payload={{ confirmed: WIN_FILTERS.SENT }}
  >
    {(page) => (
      <ul>
        {page.map((item) => (
          <li key={item.id}>
            <CollectionItem
              headingText={item.company.name}
              headingUrl={urls.companies.overview.index(item.company.id)}
              metadata={[
                { label: 'Destination', value: item.country.name },
                { label: 'Contact name', value: item.customer_name },
                {
                  label: 'Export amount',
                  value: currencyGBP(item.total_expected_export_value),
                },
                { label: 'Date won', value: formatMediumDate(item.date) },
                { label: 'Date modified', value: '???' },
              ]}
              buttons={
                <Button
                  as={ReactRouterLink}
                  to={urls.companies.exportWins.details(item.id)}
                >
                  Review export win
                </Button>
              }
            />
          </li>
        ))}
      </ul>
    )}
  </ExportWinsResource.Paginated>
)
