import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import { FONT_WEIGHTS, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import { spacing } from '@govuk-react/lib'
import {
  BORDER_COLOUR,
  LINK_ACTIVE_COLOUR,
  LINK_COLOUR,
  LINK_HOVER_COLOUR,
  LINK_VISITED_COLOUR,
  PAGE_COLOUR,
} from 'govuk-colours'
import VisuallyHidden from '@govuk-react/visually-hidden'
import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis'
import styled from 'styled-components'
import { format } from '../../utils/date-utils'

import urls from '../../../lib/urls'
import SecondaryButton from '../SecondaryButton'

const StyledButtonLink = styled.a({
  whiteSpace: 'nowrap',
  marginBottom: 0,
})

const StyledTableRow = styled.tr({
  borderBottom: `1px solid ${BORDER_COLOUR}`,

  [MEDIA_QUERIES.TABLET]: {
    borderBottom: 'none',
  },
})

const StyledCell = styled.td({
  padding: 0,
  borderBottom: 'none',
})
// based on: https://github.com/govuk-react/govuk-react/blob/master/components/table/src/atoms/Cell/index.js
const StyledTableCell = styled(StyledCell)(
  {
    display: 'inline-block',
    [MEDIA_QUERIES.TABLET]: {
      display: 'table-cell',
      padding: `${SPACING.SCALE_2} ${SPACING.SCALE_4} ${SPACING.SCALE_2} 0px`,
      borderBottom: `1px solid ${BORDER_COLOUR}`,
    },
  },
  spacing.withWidth()
)

const StyledHeaderCell = styled(StyledCell)({
  display: 'none',
  fontWeight: FONT_WEIGHTS.bold,
  [MEDIA_QUERIES.TABLET]: {
    display: 'table-cell',
    borderBottom: `1px solid ${BORDER_COLOUR}`,
  },
})

const TitleCell = styled(StyledTableCell)({
  paddingTop: SPACING.SCALE_3,
  [MEDIA_QUERIES.TABLET]: {
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
  [MEDIA_QUERIES.TABLET]: {
    marginTop: 0,
    '::before': {
      content: 'none',
    },
  },
})

const StyledLink = styled(Link)({
  ':focus': {
    color: LINK_COLOUR,
    ':active': {
      color: LINK_ACTIVE_COLOUR,
    },
    ':hover': {
      color: LINK_HOVER_COLOUR,
    },
    ':visited': {
      color: LINK_VISITED_COLOUR,
    },
  },
})

const StyledLinesEllipsis = styled(LinesEllipsis)({
  display: 'inline-block',
  background: PAGE_COLOUR,
  textDecoration: 'underline',
})

const ActionCell = styled(StyledTableCell)({
  paddingTop: SPACING.SCALE_2,
  paddingBottom: SPACING.SCALE_4,
  width: '100%',
  [MEDIA_QUERIES.TABLET]: {
    paddingRight: 0,
    paddingBottom: `${SPACING.SCALE_2}`,
  },
})

const Advisers = ({ ditParticipants }) =>
  ditParticipants.length === 0
    ? 'Unknown adviser - Unknown team'
    : ditParticipants.length > 1
    ? 'Multiple advisers'
    : ditParticipants.map((adviser, index) => (
        <div key={index}>
          {`${adviser.name || 'Unknown adviser'} - ${adviser.team ||
            'Unknown team'}`}
        </div>
      ))

const CompaniesTable = ({ companies }) => (
  <Table
    head={
      <Table.Row>
        <StyledHeaderCell>Company name</StyledHeaderCell>
        <StyledHeaderCell>Last interaction</StyledHeaderCell>
        <StyledHeaderCell>Subject</StyledHeaderCell>
        <StyledHeaderCell>Added by</StyledHeaderCell>
        <StyledHeaderCell>
          <VisuallyHidden>Action</VisuallyHidden>
        </StyledHeaderCell>
      </Table.Row>
    }
  >
    {companies.map(
      ({ id, name, date, subject, interactionId, ditParticipants }) => (
        <StyledTableRow key={id}>
          <TitleCell setWidth="20%">
            <StyledLink href={urls.companies.detail(id)}>
              <StyledLinesEllipsis
                text={name}
                maxLine="2"
                ellipsis="..."
                trimRight={true}
                basedOn="words"
              />
            </StyledLink>
          </TitleCell>
          <ColumnLabelCell setWidth="15%">
            {date ? format(date) : '-'}
          </ColumnLabelCell>
          <StyledTableCell setWidth="30%">
            {interactionId ? (
              <StyledLink href={urls.interactions.detail(interactionId)}>
                <StyledLinesEllipsis
                  text={subject}
                  maxLine="2"
                  ellipsis="..."
                  trimRight={true}
                  basedOn="words"
                />
              </StyledLink>
            ) : (
              'No interactions have been recorded'
            )}
          </StyledTableCell>
          <StyledTableCell setWidth="20%">
            <Advisers ditParticipants={ditParticipants} />
          </StyledTableCell>
          <ActionCell>
            <SecondaryButton
              as={StyledButtonLink}
              href={urls.companies.interactions.create(id)}
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
