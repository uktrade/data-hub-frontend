import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import VisuallyHidden from '@govuk-react/visually-hidden'
import React from 'react'
import styled from 'styled-components'

import LinesEllipsis from '../LinesEllipsis'

import { BORDER_COLOUR } from '../../../client/utils/colours'
import urls from '../../../lib/urls'
import { MEDIA_QUERIES } from '../../utils/responsive'
import SecondaryButton from '../SecondaryButton'

const { formatDate, DATE_FORMAT_COMPACT } = require('../../utils/date-utils')

const StyledButtonLink = styled.a({
  marginBottom: 0,
  width: '100%',
})

const StyledTableRow = styled.tr({
  borderBottom: `1px solid ${BORDER_COLOUR}`,

  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    borderBottom: 'none',
  },
})

const StyledCell = styled.td({
  padding: 0,
  borderBottom: 'none',
})
const StyledHeaderCell = styled.th({
  padding: 0,
  borderBottom: 'none',
})
const StyledTableCell = styled(StyledCell)({
  display: 'inline-block',
  width: '100%',
  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    display: 'table-cell',
    width: 'auto',
    padding: `${SPACING.SCALE_2} ${SPACING.SCALE_4} ${SPACING.SCALE_2} 0`,
    borderBottom: `1px solid ${BORDER_COLOUR}`,
  },
})

const StyledTableHeaderCell = styled(StyledHeaderCell)({
  display: 'none',
  fontWeight: FONT_WEIGHTS.bold,
  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    display: 'table-cell',
    borderBottom: `1px solid ${BORDER_COLOUR}`,
  },
})

const TitleCell = styled(StyledTableCell)({
  paddingTop: SPACING.SCALE_3,
  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    paddingTop: SPACING.SCALE_2,
  },
})

const ColumnLabelCell = styled(StyledTableCell)({
  position: 'relative',
  marginTop: `${SPACING.SCALE_5}`,
  '::before': {
    content: "'Last interaction'",
    position: 'absolute',
    top: `-${SPACING.SCALE_4}`,
    // the table element seems to have the font size hard coded to 19px, not a variable
    fontSize: 'smaller',
  },
  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    marginTop: 0,
    '::before': {
      content: 'none',
    },
  },
})

const ActionCell = styled(StyledTableCell)({
  paddingTop: SPACING.SCALE_2,
  paddingBottom: SPACING.SCALE_4,
  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    paddingRight: 0,
    paddingBottom: SPACING.SCALE_2,
  },
})

const Advisers = ({ ditParticipants }) =>
  ditParticipants.length === 0
    ? 'Unknown adviser - Unknown team'
    : ditParticipants.length > 1
      ? 'Multiple advisers'
      : ditParticipants.map((adviser, index) => (
          <div key={index}>
            {`${adviser.name || 'Unknown adviser'} - ${
              adviser.team || 'Unknown team'
            }`}
          </div>
        ))

const CompaniesTable = ({ companies }) => (
  <Table
    head={
      <Table.Row>
        <StyledTableHeaderCell width="auto">Company name</StyledTableHeaderCell>
        <StyledTableHeaderCell width="15%">
          Last interaction
        </StyledTableHeaderCell>
        <StyledTableHeaderCell width="25%">Subject</StyledTableHeaderCell>
        <StyledTableHeaderCell width="20%">Added by</StyledTableHeaderCell>
        <StyledTableHeaderCell width="151px">
          <VisuallyHidden>Action</VisuallyHidden>
        </StyledTableHeaderCell>
      </Table.Row>
    }
  >
    {companies.map(
      ({ id, name, date, subject, interactionId, ditParticipants }) => (
        <StyledTableRow key={id}>
          <TitleCell>
            <LinesEllipsis
              maxLine={2}
              as={Link}
              href={urls.companies.detail(id)}
            >
              {name}
            </LinesEllipsis>
          </TitleCell>
          <ColumnLabelCell>
            {date ? formatDate(date, DATE_FORMAT_COMPACT) : '-'}
          </ColumnLabelCell>
          <StyledTableCell>
            {interactionId ? (
              <LinesEllipsis
                maxLine={2}
                as={Link}
                href={urls.interactions.detail(interactionId)}
              >
                {subject}
              </LinesEllipsis>
            ) : (
              'No interactions have been recorded'
            )}
          </StyledTableCell>
          <StyledTableCell>
            <Advisers ditParticipants={ditParticipants} />
          </StyledTableCell>
          <ActionCell>
            <SecondaryButton
              as={StyledButtonLink}
              href={urls.companies.interactions.create(id)}
              aria-label={`Add interaction with ${name}`}
            >
              Add interaction
            </SecondaryButton>
          </ActionCell>
        </StyledTableRow>
      )
    )}
  </Table>
)

export default CompaniesTable
