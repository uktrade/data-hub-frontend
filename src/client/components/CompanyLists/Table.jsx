import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import { FONT_WEIGHTS, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
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

import urls from '../../../lib/urls'
import SecondaryButton from '../SecondaryButton'

const { format } = require('../../utils/date')

const getMediaQuery = (theme) =>
  theme?.table?.toColumnsMediaQuery || MEDIA_QUERIES.TABLET

const StyledButtonLink = styled.a({
  marginBottom: 0,
  width: '100%',
})

const StyledTableRow = styled.tr(({ theme }) => ({
  borderBottom: `1px solid ${BORDER_COLOUR}`,

  [getMediaQuery(theme)]: {
    borderBottom: 'none',
  },
}))

const StyledCell = styled.td({
  padding: 0,
  borderBottom: 'none',
})
const StyledTableCell = styled(StyledCell)(({ theme }) => ({
  display: 'inline-block',
  width: '100%',
  [getMediaQuery(theme)]: {
    display: 'table-cell',
    width: 'auto',
    padding: `${SPACING.SCALE_2} ${SPACING.SCALE_4} ${SPACING.SCALE_2} 0`,
    borderBottom: `1px solid ${BORDER_COLOUR}`,
  },
}))

const StyledHeaderCell = styled(StyledCell)(({ theme }) => ({
  display: 'none',
  fontWeight: FONT_WEIGHTS.bold,
  [getMediaQuery(theme)]: {
    display: 'table-cell',
    borderBottom: `1px solid ${BORDER_COLOUR}`,
  },
}))

const TitleCell = styled(StyledTableCell)(({ theme }) => ({
  paddingTop: SPACING.SCALE_3,
  [getMediaQuery(theme)]: {
    paddingTop: SPACING.SCALE_2,
  },
}))

const ColumnLabelCell = styled(StyledTableCell)(({ theme }) => ({
  position: 'relative',
  marginTop: `${SPACING.SCALE_5}`,
  '::before': {
    content: "'Last interaction'",
    position: 'absolute',
    top: `-${SPACING.SCALE_4}`,
    // the table element seems to have the font size hard coded to 19px, not a variable
    fontSize: 'smaller',
  },
  [getMediaQuery(theme)]: {
    marginTop: 0,
    '::before': {
      content: 'none',
    },
  },
}))

const ActionCell = styled(StyledTableCell)(({ theme }) => ({
  paddingTop: SPACING.SCALE_2,
  paddingBottom: SPACING.SCALE_4,
  [getMediaQuery(theme)]: {
    paddingRight: 0,
    paddingBottom: SPACING.SCALE_2,
  },
}))

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
        <StyledHeaderCell width="auto">Company name</StyledHeaderCell>
        <StyledHeaderCell width="15%">Last interaction</StyledHeaderCell>
        <StyledHeaderCell width="20%">Subject</StyledHeaderCell>
        <StyledHeaderCell width="20%">Added by</StyledHeaderCell>
        <StyledHeaderCell width="151px">
          <VisuallyHidden>Action</VisuallyHidden>
        </StyledHeaderCell>
      </Table.Row>
    }
  >
    {companies.map(
      ({ id, name, date, subject, interactionId, ditParticipants }) => (
        <StyledTableRow key={id}>
          <TitleCell>
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
          <ColumnLabelCell>{date ? format(date) : '-'}</ColumnLabelCell>
          <StyledTableCell>
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
