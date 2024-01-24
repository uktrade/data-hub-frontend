import React from 'react'
import { Button } from 'govuk-react'
import { Link } from 'react-router-dom/cjs/react-router-dom'

import { CollectionItem } from '../../../components'
import { formatMediumDate } from '../../../utils/date'
import { currencyGBP } from '../../../utils/number-utils'
import ExportWinsResource from '../../../components/Resource/ExportWins'
import urls from '../../../../lib/urls'

export default () => (
  <ExportWinsResource.Paginated
    id="unconfirmed-export-wins"
    // TODO: The filtering is not yet implemented in the API
    // update the payload once it's implemented
    payload={{ filter: 'unconfirmed' }}
  >
    {(page) => (
      <ul>
        {page.map((item) => (
          <li key={item.id}>
            <CollectionItem
              headingText={item.company.name}
              headingUrl={urls.companies.detail(item.company.id)}
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
                  as={Link}
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
