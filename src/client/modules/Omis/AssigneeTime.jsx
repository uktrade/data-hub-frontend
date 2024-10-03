import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Link, Table } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'

import { FieldInput, Form, FormLayout, StatusMessage } from '../../components'
import {
  OrderResource,
  OrderAssigneesResource,
} from '../../components/Resource'
import urls from '../../../lib/urls'
import { FORM_LAYOUT } from '../../../common/constants'
import { validateNumber } from './validators'
import { TASK_EDIT_ORDER_ASSIGNEE_TIME } from './state'
import { transformAssigneeTimeForApi } from './transformers'
import { RED } from '../../utils/colours'
import OMISLayout from './OMISLayout'

const StyledLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${SPACING.SCALE_5};
`

const getEstimatedTime = (estimatedTime) => {
  return estimatedTime > 0 ? (estimatedTime / 60).toString() : ''
}

const buildRows = (assignees) =>
  assignees.map(({ adviser, estimatedTime }, index) => (
    <Table.Row key={adviser.id}>
      <Table.Cell bold={true}>{adviser.name}</Table.Cell>
      <Table.Cell>
        <FormLayout setWidth={FORM_LAYOUT.ONE_HALF}>
          <FieldInput
            name={`${adviser.id}`}
            dataTest={`adviser-${index}`}
            type="text"
            initialValue={getEstimatedTime(estimatedTime)}
            validate={validateNumber}
            aria-label={`Estimated hours for ${adviser.name}`}
          />
        </FormLayout>
      </Table.Cell>
    </Table.Row>
  ))

export const AssigneeTimeTable = ({ order, assignees }) => (
  <>
    <p data-test="estimated-hours-message">
      Estimated hours will be used to calculate the cost of the order.
      <br />
      <br />
      All work will be charged at £55 per hour.
    </p>
    <Form
      id="edit-order-assignee-time"
      analyticsFormName="editOrderAssigneeTime"
      submitButtonLabel="Save and return"
      cancelButtonLabel="Return without saving"
      cancelRedirectTo={() => urls.omis.order(order.id)}
      flashMessage={() => 'Estimated work hours updated'}
      redirectTo={() => urls.omis.order(order.id)}
      submissionTaskName={TASK_EDIT_ORDER_ASSIGNEE_TIME}
      transformPayload={(values) =>
        transformAssigneeTimeForApi({
          orderId: order.id,
          values,
        })
      }
    >
      <Table data-test="assignee-table">
        <Table.Row>
          <Table.Cell setWidth="75%" />
          <Table.CellHeader setWidth="25%">Estimated hours</Table.CellHeader>
        </Table.Row>
        {buildRows(assignees)}
      </Table>
      <StyledLink
        href={urls.omis.edit.assignees(order.id)}
        data-test="edit-advisers-link"
      >
        Edit advisers
      </StyledLink>
    </Form>
  </>
)

export const NoAssigneesMessage = ({ order }) => (
  <>
    <StatusMessage colour={RED} data-test="no-assignees-message">
      To add estimated hours you must add advisers in the market.
      <br />
      <br />
      <Link
        href={urls.omis.edit.assignees(order.id)}
        data-test="add-advisers-link"
      >
        Add advisers
      </Link>
    </StatusMessage>
    <StyledLink href={urls.omis.order(order.id)} data-test="return-link">
      Return without saving
    </StyledLink>
  </>
)

const AssigneeTime = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OrderAssigneesResource id={orderId}>
          {(assignees) => (
            <OMISLayout heading="Edit estimated hours of work" order={order}>
              {assignees.length > 0 ? (
                <AssigneeTimeTable order={order} assignees={assignees} />
              ) : (
                <NoAssigneesMessage order={order} />
              )}
            </OMISLayout>
          )}
        </OrderAssigneesResource>
      )}
    </OrderResource>
  )
}

export default AssigneeTime
