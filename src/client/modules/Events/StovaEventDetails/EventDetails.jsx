import React from 'react'
import { compact, isEmpty } from 'lodash'
import styled from 'styled-components'

import urls from '../../../../lib/urls'
import { NewWindowLink, SummaryTable } from '../../../components'
import { formatStartAndEndDate } from '../../../components/ActivityFeed/activities/date'
import { isEmptyWithDefault } from './utils'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../utils/date-utils'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

export const EventDetails = ({ stovaEvent }) => {
  const locationAddress = compact([
    stovaEvent.locationAddress1,
    stovaEvent.locationAddress2,
    stovaEvent.locationAddress3,
    stovaEvent.locationCity,
    stovaEvent.locationPostcode,
    stovaEvent.locationState,
    stovaEvent.locationCountry,
  ])
  const eventDate = formatStartAndEndDate(
    stovaEvent.startDate,
    stovaEvent.endDate
  )
  return (
    <StyledSummaryTable>
      <SummaryTable.Row
        heading="Name"
        children={isEmptyWithDefault(stovaEvent.name)}
      />
      <SummaryTable.Row
        heading="Event date"
        children={isEmptyWithDefault(eventDate)}
      />
      <SummaryTable.Row
        heading="Event location name"
        children={isEmptyWithDefault(stovaEvent.locationName)}
      />
      <SummaryTable.Row
        heading="Location Address"
        children={isEmptyWithDefault(locationAddress)}
      />
      <SummaryTable.Row
        heading="Stova reference number"
        children={
          stovaEvent.stovaEventId ? (
            <>
              {stovaEvent.stovaEventId}{' '}
              <NewWindowLink
                href={urls.external.stova(stovaEvent.stovaEventId)}
              >
                View in Stova
              </NewWindowLink>
            </>
          ) : (
            'Not set'
          )
        }
      />
      <SummaryTable.Row
        heading="Approval Required"
        children={isEmptyWithDefault(stovaEvent.approvalRequired)}
      />
      <SummaryTable.Row
        heading="Close Date"
        children={
          isEmpty(stovaEvent.closeDate)
            ? 'Not set'
            : formatDate(stovaEvent.closeDate, DATE_FORMAT_MEDIUM_WITH_TIME)
        }
      />
      <SummaryTable.Row
        heading="Code"
        children={isEmptyWithDefault(stovaEvent.code)}
      />
      <SummaryTable.Row
        heading="Contact Info"
        children={isEmptyWithDefault(stovaEvent.contactInfo)}
      />
      <SummaryTable.Row
        heading="Default Language"
        children={isEmptyWithDefault(stovaEvent.defaultLanguage)}
      />
      <SummaryTable.Row
        heading="Description"
        children={isEmptyWithDefault(stovaEvent.description)}
      />
      <SummaryTable.Row
        heading="Price Type"
        children={isEmptyWithDefault(stovaEvent.priceType)}
      />
      <SummaryTable.Row
        heading="Standard Currency"
        children={isEmptyWithDefault(stovaEvent.standardCurrency)}
      />
      <SummaryTable.Row
        heading="Live Date"
        children={
          isEmpty(stovaEvent.liveDate)
            ? 'Not set'
            : formatDate(stovaEvent.liveDate, DATE_FORMAT_MEDIUM_WITH_TIME)
        }
      />
      <SummaryTable.Row
        heading="Folder ID"
        children={isEmptyWithDefault(stovaEvent.folderId)}
      />
      <SummaryTable.Row
        heading="Max Reg"
        children={isEmptyWithDefault(stovaEvent.maxReg)}
      />
      <SummaryTable.Row
        heading="Address"
        children={isEmptyWithDefault(
          compact([stovaEvent.city, stovaEvent.country, stovaEvent.state])
        )}
      />
      <SummaryTable.Row
        heading="Timezone"
        children={isEmptyWithDefault(stovaEvent.timezone)}
      />
      <SummaryTable.Row
        heading="Created By"
        children={isEmptyWithDefault(stovaEvent.createdBy)}
      />
      <SummaryTable.Row
        heading="Created Date"
        children={
          isEmpty(stovaEvent.createdDate)
            ? 'Not set'
            : formatDate(stovaEvent.createdDate, DATE_FORMAT_MEDIUM_WITH_TIME)
        }
      />
      <SummaryTable.Row
        heading="Modified By"
        children={isEmptyWithDefault(stovaEvent.modifiedBy)}
      />
      <SummaryTable.Row
        heading="Modified Date"
        children={
          isEmpty(stovaEvent.modifiedDate)
            ? 'Not set'
            : formatDate(stovaEvent.modifiedDate, DATE_FORMAT_MEDIUM_WITH_TIME)
        }
      />
    </StyledSummaryTable>
  )
}
