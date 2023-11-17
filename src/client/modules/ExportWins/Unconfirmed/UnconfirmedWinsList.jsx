import React from 'react'
import { Button } from 'govuk-react'

import { SecondaryButton, CollectionItem } from '../../../components'
import { formatMediumDate } from '../../../utils/date'
import { currencyGBP } from '../../../utils/number-utils'
import ExportWinsResource from '../../../components/Resource/ExportWins'

export default () => (
  <ExportWinsResource.Paginated
    id="unconfirmed-export-wins"
    payload={{ filter: 'unconfirmed' }}
  >
    {(page) => (
      <ul>
        {page.map((item) => (
          <li key={item.id}>
            <CollectionItem
              headingText={item.company.name}
              headingUrl={`company-url/${item.company.id}`}
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
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button as="a" href={`review/${item.id}`}>
                    Review export win
                  </Button>
                  <SecondaryButton as="a" href={`edit/${item.id}`}>
                    Edit export win
                  </SecondaryButton>
                </div>
              }
            />
          </li>
        ))}
      </ul>
    )}
  </ExportWinsResource.Paginated>
)
