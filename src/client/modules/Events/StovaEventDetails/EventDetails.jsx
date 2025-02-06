import React from 'react'
import { compact, isEmpty } from 'lodash'
import styled from 'styled-components'

import { NewWindowLink, SummaryTable } from '../../../components'
import { formatStartAndEndDate } from '../../../components/ActivityFeed/activities/date'
import { getExternalStovaLink } from './constants'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../utils/date-utils'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

export const EventDetails = ({ stovaEvent }) => {
  const stovaLink = stovaEvent.stovaEventId
    ? getExternalStovaLink(stovaEvent.stovaEventId)
    : ''
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
        children={isEmpty(stovaEvent.name) ? 'Not set' : stovaEvent.name}
      />
      <SummaryTable.Row
        heading="Event date"
        children={isEmpty(eventDate) ? 'Not set' : eventDate}
      />
      <SummaryTable.Row
        heading="Event location name"
        children={
          isEmpty(stovaEvent.locationName) ? 'Not set' : stovaEvent.locationName
        }
      />
      <SummaryTable.Row
        heading="Location Address"
        children={isEmpty(locationAddress) ? 'Not set' : locationAddress}
      />
      <SummaryTable.Row
        heading="Stova reference number"
        children={
          stovaLink ? (
            <>
              {stovaEvent.stovaEventId}{' '}
              <NewWindowLink href={stovaLink}>View in Stova</NewWindowLink>
            </>
          ) : (
            'Not set'
          )
        }
      />
      <SummaryTable.Row
        heading="Approval Required"
        children={
          isEmpty(stovaEvent.approvalRequired)
            ? 'Not set'
            : stovaEvent.approvalRequired
        }
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
        children={isEmpty(stovaEvent.code) ? 'Not set' : stovaEvent.code}
      />
      <SummaryTable.Row
        heading="Contact Info"
        children={
          isEmpty(stovaEvent.contactInfo) ? 'Not set' : stovaEvent.contactInfo
        }
      />
      <SummaryTable.Row
        heading="Default Language"
        children={
          isEmpty(stovaEvent.defaultLanguage)
            ? 'Not set'
            : stovaEvent.defaultLanguage
        }
      />
      <SummaryTable.Row
        heading="Description"
        children={
          isEmpty(stovaEvent.description) ? 'Not set' : stovaEvent.description
        }
      />
      <SummaryTable.Row
        heading="Price Type"
        children={
          isEmpty(stovaEvent.priceType) ? 'Not set' : stovaEvent.priceType
        }
      />
      <SummaryTable.Row
        heading="Standard Currency"
        children={
          isEmpty(stovaEvent.standardCurrency)
            ? 'Not set'
            : stovaEvent.standardCurrency
        }
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
        children={
          isEmpty(stovaEvent.folderId) ? 'Not set' : stovaEvent.folderId
        }
      />
      <SummaryTable.Row
        heading="Max Reg"
        children={isEmpty(stovaEvent.maxReg) ? 'Not set' : stovaEvent.maxReg}
      />
      <SummaryTable.Row
        heading="Address"
        children={
          isEmpty(
            compact([stovaEvent.city, stovaEvent.country, stovaEvent.state])
          )
            ? 'Not set'
            : compact([stovaEvent.city, stovaEvent.country, stovaEvent.state])
        }
      />
      <SummaryTable.Row
        heading="Timezone"
        children={
          isEmpty(stovaEvent.timezone) ? 'Not set' : stovaEvent.timezone
        }
      />
      <SummaryTable.Row
        heading="Created By"
        children={
          isEmpty(stovaEvent.createdBy) ? 'Not set' : stovaEvent.createdBy
        }
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
        children={
          isEmpty(stovaEvent.modifiedBy) ? 'Not set' : stovaEvent.modifiedBy
        }
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
