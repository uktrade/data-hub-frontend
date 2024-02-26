import React from 'react'
import styled from 'styled-components'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { TaskButton } from '../../../components/Task/TaskButton'
import { currencyGBP } from '../../../utils/number-utils'
import { formatMediumDate } from '../../../utils/date'
import { CollectionItem } from '../../../components'
import { TASK_RESEND_EXPORT_WIN } from './state'
import { WIN_FILTERS } from './constants'
import urls from '../../../../lib/urls'

const TaskButtonContainer = styled('div')({
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
                {
                  label: 'Date won: ',
                  value: formatMediumDate(item.date),
                },
                { label: 'First sent: ', value: '???' },
                { label: 'Last sent: ', value: '???' },
              ]}
              buttonRenderer={() => (
                <TaskButtonContainer>
                  <TaskButton
                    id={item.id}
                    name={TASK_RESEND_EXPORT_WIN}
                    startOptions={{ payload: item.id }}
                  >
                    Resend export win
                  </TaskButton>
                </TaskButtonContainer>
              )}
            />
          </li>
        ))}
      </ul>
    )}
  </ExportWinsResource.Paginated>
)
