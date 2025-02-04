import React from 'react'

import { LEVEL_SIZE } from '@govuk-react/constants'
import { H2 } from 'govuk-react'

import Interactions from '../../../components/Resource/Interactions'
import { formatDate, DATE_FORMAT_FULL } from '../../../utils/date-utils'
import { CollectionItem } from '../../../components'
import { ExportProjectTitle } from '../Export'
import urls from '../../../../lib/urls'
import { SORT_OPTIONS_EXPORT_INTERACTION } from '../constants'

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
  <>
    <H2 size={LEVEL_SIZE[3]}>Interactions</H2>
    <p>
      An interaction could be a meeting, call, email or another activity
      associated with this export.
    </p>
    <Interactions.Paginated
      id="export-interactions"
      heading="interactions"
      shouldPluralize={true}
      noResults="You don't have any export interactions."
      payload={{ company_export_id: exportId }}
      sortOptions={SORT_OPTIONS_EXPORT_INTERACTION}
    >
      {(page) => (
        <ExportInteractionsList interactions={page} exportId={exportId} />
      )}
    </Interactions.Paginated>
  </>
)
