import React from 'react'

import Interactions from '../../../components/Resource/Interactions'
import { formatDate, DATE_FORMAT_FULL } from '../../../utils/date-utils'
import { CollectionItem } from '../../../components'
import { ExportProjectTitle } from '../Export'
import urls from '../../../../lib/urls'

const ExportInteractionsList = ({ interactions = [], exportId }) =>
  interactions.length === 0 ? null : (
    <ul data-test="export-interactions-list">
      {interactions.map((item) => (
        <CollectionItem
          key={item.id}
          headingText={<ExportProjectTitle id={exportId} />}
          headingUrl={urls.exportPipeline.interactions.details(exportId)}
          metadata={[
            {
              label: 'Date:',
              value: formatDate(item.date, DATE_FORMAT_FULL),
            },
            {
              label: 'Contact(s):',
              value: item.contacts.map(({ name }) => name).join(', '),
            },
            {
              label: 'Adviser(s):',
              value: item.dit_participants
                .map(({ adviser, team }) => `${adviser.name} - ${team.name}`)
                .join(', '),
            },
            {
              label: 'Service:',
              value: item.service.name,
            },
          ]}
        />
      ))}
    </ul>
  )

export default ({ exportId }) => (
  <Interactions.Paginated
    id="export-interactions"
    heading="interactions"
    shouldPluralize={true}
    noResults="You don't have any export interactions."
    payload={{ company_export_id: exportId }}
    sortOptions={[
      // These values are assumed as the BE work hasn't been implemented yet
      { value: 'created_on:desc', name: 'Recently created' },
      { value: 'company.name:asc', name: 'Company A-Z' },
      { value: 'subject:asc', name: 'Subject A-Z' },
    ]}
  >
    {(page) => (
      <ExportInteractionsList interactions={page} exportId={exportId} />
    )}
  </Interactions.Paginated>
)
