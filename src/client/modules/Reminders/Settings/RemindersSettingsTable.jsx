import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import Table from '@govuk-react/table'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'

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

const SettingsTable = ({ dataName, to, children }) => (
  <>
    <StyledTable data-test={`${dataName}-table`}>{children}</StyledTable>
    {to && (
      <StyledRouterLink
        data-test={`${dataName}-link`}
        to={to}
        aria-label="edit"
      >
        Edit
      </StyledRouterLink>
    )}
  </>
)

export const RemindersSettingsTable = ({ dataName, data, to }) => (
  <SettingsTable dataName={dataName} to={to}>
    <Table.Row>
      <StyledCellHeader>Reminders</StyledCellHeader>
      <Table.Cell>{data.formattedReminderDays}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <StyledCellHeader>Email notifications</StyledCellHeader>
      <Table.Cell>{data.emailRemindersOnOff}</Table.Cell>
    </Table.Row>
  </SettingsTable>
)

export const EmailRemindersSettingsTable = ({ dataName, data, to }) => (
  <SettingsTable dataName={dataName} to={to}>
    <Table.Row>
      <StyledCellHeader>Email notifications</StyledCellHeader>
      <Table.Cell>{data.emailRemindersOnOff}</Table.Cell>
    </Table.Row>
  </SettingsTable>
)

export default RemindersSettingsTable
