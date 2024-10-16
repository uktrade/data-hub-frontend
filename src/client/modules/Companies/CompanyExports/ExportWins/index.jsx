import React from 'react'
import styled from 'styled-components'

import CompanyExportWins from '../../../../components/Resource/CompanyExportWins'
import { WIN_STATUS } from '../../../../modules/ExportWins/Status/constants'
import { createRoleTags } from '../../../ExportWins/Status/utils'
import { currencyGBP } from '../../../../utils/number-utils'
import { formatShortDate } from '../../../../utils/date'
import { CollectionItem } from '../../../../components'
import { BLACK } from '../../../../utils/colours'
import State from '../../../../components/State'

const Black = styled('span')({
  color: BLACK,
})

export const SORT_OPTIONS = [
  { name: 'Newest', value: '-created_on' },
  { name: 'Oldest', value: 'created_on' },
]

export const CompanyExportWinsList = ({ exportWins, currentAdviserId }) =>
  exportWins.length === 0 ? null : (
    <ul data-test="collectionItems">
      {exportWins.map((item) => (
        <CollectionItem
          key={item.id}
          headingText={`${item.name_of_export} to ${item?.country}`}
          tags={createRoleTags(item, currentAdviserId)}
          metadata={[
            {
              label: 'Lead officer name',
              value: <Black>{item.lead_officer.name}</Black>,
            },
            {
              label: 'Contact name',
              value: (
                <Black>{`${item.contact.name} (${item.contact.job_title} - ${item.contact.email})`}</Black>
              ),
            },
            {
              label: 'Destination',
              value: <Black>{item.country}</Black>,
            },
            {
              label: 'Date won',
              value: <Black>{formatShortDate(item.date)}</Black>,
            },
            {
              label: 'Type of win',
              value: <Black>{item.business_type}</Black>,
            },
            {
              label: 'Total value',
              value: <Black>{currencyGBP(item.value.export.total)}</Black>,
            },
            {
              label: 'Type of goods or services',
              value: <Black>{item.name_of_export}</Black>,
            },
            {
              label: 'Sector',
              value: <Black>{item.sector}</Black>,
            },
          ]}
        />
      ))}
    </ul>
  )

export default ({ companyId }) => (
  <CompanyExportWins.Paginated
    id={companyId}
    heading="Confirmed export win"
    noResults="There are no confirmed export wins."
    payload={{ confirmed: WIN_STATUS.CONFIRMED }}
    sortOptions={SORT_OPTIONS}
  >
    {(page) => (
      <State>
        {({ currentAdviserId }) => (
          <CompanyExportWinsList
            currentAdviserId={currentAdviserId}
            exportWins={page}
            companyId={companyId}
          />
        )}
      </State>
    )}
  </CompanyExportWins.Paginated>
)
