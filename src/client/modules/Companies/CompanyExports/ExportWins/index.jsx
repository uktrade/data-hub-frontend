import React from 'react'
import styled from 'styled-components'

import CompanyExportWins from '../../../../components/Resource/CompanyExportWins'
import { currencyGBP } from '../../../../utils/number-utils'
import { formatShortDate } from '../../../../utils/date'
import { CollectionItem } from '../../../../components'
import urls from '../../../../../lib/urls'
import { WIN_STATUS } from '../../../../modules/ExportWins/Status/constants'

const Bold = styled('span')({
  fontWeight: 'bold',
})

export const SORT_OPTIONS = [
  { name: 'Newest', value: '-created_on' },
  { name: 'Oldest', value: 'created_on' },
]

export const ExportWinsList = ({ exportWins, companyId }) =>
  exportWins.length === 0 ? null : (
    <ul data-test="collectionItems">
      {exportWins.map((item) => (
        <CollectionItem
          key={item.id}
          headingText={`${item.name_of_export} to ${item?.country}`}
          headingUrl={urls.companies.exportWins.editSummary(companyId, item.id)}
          metadata={[
            {
              label: 'Lead officer name',
              value: <Bold>{item.officer.name}</Bold>,
            },
            {
              label: 'Company name',
              value: <Bold>{item.customer || 'Not set'}</Bold>,
            },
            {
              label: 'Contact name',
              value: (
                <Bold>{`${item.contact.name} (${item.contact.job_title} - ${item.contact.email})`}</Bold>
              ),
            },
            {
              label: 'Destination',
              value: <Bold>{item.country}</Bold>,
            },
            {
              label: 'Date won',
              value: <Bold>{formatShortDate(item.date)}</Bold>,
            },
            {
              label: 'Type of win',
              value: <Bold>{item.business_type}</Bold>,
            },
            {
              label: 'Total value',
              value: <Bold>{currencyGBP(item.value.export.total)}</Bold>,
            },
            {
              label: 'Type of goods or services',
              value: <Bold>{item.name_of_export}</Bold>,
            },
            {
              label: 'Sector',
              value: <Bold>{item.sector}</Bold>,
            },
          ]}
        />
      ))}
    </ul>
  )

export default ({ companyId }) => {
  return (
    <CompanyExportWins.Paginated
      id={companyId}
      heading="Confirmed export win"
      noResults="You don't have any confirmed export wins."
      payload={{ confirmed: WIN_STATUS.CONFIRMED }}
      sortOptions={SORT_OPTIONS}
    >
      {(page) => <ExportWinsList exportWins={page} companyId={companyId} />}
    </CompanyExportWins.Paginated>
  )
}
