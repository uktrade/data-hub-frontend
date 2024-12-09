import React from 'react'

import ExportWinsResource from '../../../components/Resource/ExportWins'
import { currencyGBP } from '../../../utils/number-utils'
import {
  formatDate,
  DATE_FORMAT_MEDIUM,
  DATE_FORMAT_MONTH_ABBR_YEAR,
} from '../../../utils/date-utils'
import { CollectionItem } from '../../../components'
import { sumExportValues, createRoleTags } from './utils'
import { SORT_OPTIONS, WIN_STATUS } from './constants'
import State from '../../../components/State'
import urls from '../../../../lib/urls'
import Contact from './Contact'

export const WinsRejectedList = ({ exportWins, currentAdviserId }) => {
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
              value: <Contact win={item} />,
            },
            {
              label: 'Total value:',
              value: currencyGBP(sumExportValues(item)),
            },
            {
              label: 'Date won:',
              value: formatDate(item.date, DATE_FORMAT_MONTH_ABBR_YEAR), // Dec 2024
            },
            {
              label: 'Date modified:',
              value: formatDate(item.modified_on, DATE_FORMAT_MEDIUM), // 4 Dec 2024
            },
          ]}
        />
      ))}
    </ul>
  )
}

export default () => (
  <ExportWinsResource.Paginated
    id="export-wins-rejected"
    heading="rejected"
    shouldPluralize={false}
    noResults="You don't have any rejected export wins."
    payload={{ confirmed: WIN_STATUS.REJECTED }}
    sortOptions={SORT_OPTIONS}
  >
    {(page) => (
      <State>
        {({ currentAdviserId }) => (
          <WinsRejectedList
            exportWins={page}
            currentAdviserId={currentAdviserId}
          />
        )}
      </State>
    )}
  </ExportWinsResource.Paginated>
)
