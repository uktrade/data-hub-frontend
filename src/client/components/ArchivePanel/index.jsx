import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Main from '@govuk-react/main'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import Link from '@govuk-react/link'

import StatusMessage from '../../../client/components/StatusMessage'

const { format } = require('../../utils/date')

const negativeSpacing = '-' + SPACING.SCALE_4

const StyledMain = styled(Main)`
  padding-top: ${SPACING.SCALE_1};
  div {
    font-size: ${FONT_SIZE.SIZE_20};
  }
`

const StyledMessage = styled('p')`
  font-weight: ${FONT_WEIGHTS.bold};
`

const StyledReason = styled(StyledMessage)`
  margin-top: ${negativeSpacing};
`

const ArchivePanel = ({
  isArchived,
  archivedBy,
  archivedOn,
  archiveReason,
  unarchiveUrl,
  onClick = null,
  type,
}) => {
  if (!isArchived) {
    return null
  }
  return (
    <StyledMain>
      <StatusMessage>
        <StyledMessage data-test="archive-message">
          {archivedBy
            ? `This ${type} was archived on ${format(archivedOn)} by ${
                archivedBy.first_name
              } ${archivedBy.last_name}.`
            : `This ${type} was automatically archived on ${format(
                archivedOn
              )}.`}
        </StyledMessage>
        <StyledReason data-test="archive-reason">{`Reason: ${archiveReason}`}</StyledReason>
        <Link data-test="unarchive-link" onClick={onClick} href={unarchiveUrl}>
          Unarchive
        </Link>
      </StatusMessage>
    </StyledMain>
  )
}

ArchivePanel.propTypes = {
  isArchived: PropTypes.bool.isRequired,
  archivedBy: PropTypes.object.isRequired,
  archivedOn: PropTypes.string.isRequired,
  archiveReason: PropTypes.string.isRequired,
  unarchiveUrl: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
}

export default ArchivePanel
