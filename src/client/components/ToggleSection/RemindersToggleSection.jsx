import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import styled from 'styled-components'
import { SPACING, MEDIA_QUERIES, FONT_WEIGHTS } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'

import Table from '@govuk-react/table'

import {
  ToggleButton,
  ButtonContent,
  MultiInstanceToggleSection,
} from './BaseToggleSection'

const StyledMultiInstanceToggleSection = styled(MultiInstanceToggleSection)`
  border-top: 1px solid ${GREY_2};
  ${({ borderBottom }) => borderBottom && `border-bottom: 1px solid ${GREY_2};`}

  ${ToggleButton} {
    text-align: left;
    padding-top: ${SPACING.SCALE_3};
    padding-bottom: ${SPACING.SCALE_3};
  }

  ${ButtonContent} {
    font-weight: ${FONT_WEIGHTS.bold};
  }
`

const StyledTable = styled(Table)({
  marginTop: 0,
  marginLeft: SPACING.SCALE_1,
})

const StyledCellHeader = styled(Table.CellHeader)({
  [MEDIA_QUERIES.TABLET]: {
    width: '33%',
  },
  [MEDIA_QUERIES.DESKTOP]: {
    width: '33%',
  },
})

const StyledRouterLink = styled(RouterLink)({
  marginBottom: SPACING.SCALE_5,
  display: 'block',
})

const RemindersToggleSection = ({ dataName, data, to, ...props }) => {
  return (
    <StyledMultiInstanceToggleSection {...props}>
      <StyledTable data-test={`${dataName}-table`}>
        <Table.Row>
          <StyledCellHeader>Reminders</StyledCellHeader>
          <Table.Cell>{data.formattedReminderDays}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <StyledCellHeader>Email notifications</StyledCellHeader>
          <Table.Cell>{data.emailRemindersOnOff}</Table.Cell>
        </Table.Row>
      </StyledTable>
      <StyledRouterLink
        data-test={`${dataName}-link`}
        to={to}
        aria-label="edit"
      >
        Edit
      </StyledRouterLink>
    </StyledMultiInstanceToggleSection>
  )
}

export default RemindersToggleSection
