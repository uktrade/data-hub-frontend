import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StatusMessage from '../../StatusMessage'
import { NewWindowLink } from '../../'

const StyledStatusMessage = styled(StatusMessage)`
  div.statusHeader {
    font-size: x-large;
  }
  div.statusContent {
    font-size: medium;
  }
  div.statusLink {
    font-size: 80%;
  }
`
export default function AventriEventSyncWarning({ aventriEventId }) {
  const aventriEventLink =
    'https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid=' +
    aventriEventId
  return (
    <StyledStatusMessage>
      <div class="statusHeader">
        This event has been automatically synced from Aventri.
      </div>

      <div class="statusContent">
        Event details, registrants and attendees can only be edited in Aventri.
        Changes can take up to 24 hours to sync.
      </div>

      <div class="statusLink">
        <NewWindowLink href={aventriEventLink}>View in Aventri</NewWindowLink>
      </div>
    </StyledStatusMessage>
  )
}

AventriEventSyncWarning.propTypes = {
  aventriEventId: PropTypes.number,
}
