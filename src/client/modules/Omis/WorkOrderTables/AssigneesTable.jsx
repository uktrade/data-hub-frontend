import React from 'react'
import styled from 'styled-components'
import { Table } from 'govuk-react'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'

import { Badge } from '../../../components'
import {
  canEditOrder,
  isOrderActive,
  transformEstimatedTime,
} from '../transformers'
import urls from '../../../../lib/urls'
import { GREY_2 } from '../../../utils/colours'
import AccessibleLink from '../../../components/Link'

const StyledTable = styled(Table)`
  & > tbody th {
    width: 30%;
  }
  & > caption {
    ${typography.font({ size: 24, weight: 'bold' })};
    margin-bottom: ${SPACING.SCALE_4};
  }
  & > tbody > tr:first-child {
    border-top: 1px solid ${GREY_2};
  }
  & > caption > * {
    ${typography.font({ size: 19, weight: 'bold' })};
    float: right;
    margin-left: ${SPACING.SCALE_3};
  }
`

const StyledEndCell = styled(Table.Cell)`
  text-align: right;
`

const setAssigneeNameText = (assignee, isLead) =>
  isLead ? (
    <>
      {assignee.name} <Badge>Lead adviser</Badge>
    </>
  ) : (
    assignee.name
  )

const setAdviserEditText = (advisers, canEdit) =>
  advisers.length > 0 && canEdit ? 'Add or remove' : 'Add'

const calculateTotalEstimatedHours = (assignees) => {
  const total = assignees.reduce(
    (acc, assignee) => acc + assignee.estimatedTime,
    0
  )

  return transformEstimatedTime(total)
}

const buildAssigneeRows = (assignees, order) =>
  assignees.map(({ adviser, estimatedTime, isLead }) => (
    <Table.Row key={adviser.id}>
      <Table.Cell setWidth="one-half">
        {setAssigneeNameText(adviser, isLead)}
      </Table.Cell>
      <Table.Cell setWidth="35%">
        {isOrderActive(order) &&
          (isLead ? (
            ''
          ) : (
            <AccessibleLink
              href={urls.omis.edit.setLeadAssignee(order.id, adviser.id)}
              data-test={`set-lead-adviser-link-${adviser.id}`}
              noVisitedState={true}
            >
              Set as lead adviser
            </AccessibleLink>
          ))}
      </Table.Cell>
      <StyledEndCell>
        {estimatedTime > 0
          ? transformEstimatedTime(estimatedTime)
          : 'No hours estimated'}
      </StyledEndCell>
    </Table.Row>
  ))

const AssigneesTable = ({ assignees, order }) => (
  <StyledTable
    caption={[
      'Advisers in the market',
      [
        isOrderActive(order) && (
          <AccessibleLink
            key="addAssigneeLink"
            href={urls.omis.edit.assignees(order.id)}
            aria-label={`${setAdviserEditText(
              assignees,
              canEditOrder(order)
            )} advisers in the market`}
            data-test="add-assignees-link"
            noVisitedState={true}
          >
            {setAdviserEditText(assignees, canEditOrder(order))}
          </AccessibleLink>
        ),
        canEditOrder(order) && (
          <AccessibleLink
            key="estimateHours"
            href={urls.omis.edit.assigneeTime(order.id)}
            data-test="assignee-time-link"
            noVisitedState={true}
          >
            Estimate hours
          </AccessibleLink>
        ),
      ],
    ]}
    data-test="assignees-table"
  >
    {assignees.length > 0 ? (
      buildAssigneeRows(assignees, order)
    ) : (
      <Table.Row>
        <Table.Cell>No advisers added</Table.Cell>
      </Table.Row>
    )}
    {calculateTotalEstimatedHours(assignees).replace(/[^0-9]/g, '') > 0 && (
      <Table.Row>
        <Table.Cell setWidth="one-half" />
        <Table.Cell setWidth="35%" />
        <StyledEndCell bold={true}>
          {calculateTotalEstimatedHours(assignees)}
          <br />
          estimated in total
        </StyledEndCell>
      </Table.Row>
    )}
  </StyledTable>
)

export default AssigneesTable
