import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Button } from 'govuk-react'
import styled from 'styled-components'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate } from '../../../utils/date'
import { CollectionItem } from '../../../components'
import { WIN_FILTERS } from './constants'
import urls from '../../../../lib/urls'

const ButtonContainer = styled('div')({
  marginTop: 10,
})

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
                { label: 'First sent: ', value: '???' },
                { label: 'Last sent: ', value: '???' },
              ]}
              buttonRenderer={() => (
                <ButtonContainer>
                  <Button as={ReactRouterLink} onClick={() => alert('TODO')}>
                    Resend export win
                  </Button>
                </ButtonContainer>
              )}
            />
          </li>
        ))}
      </ul>
    )}
  </ExportWinsResource.Paginated>
)
