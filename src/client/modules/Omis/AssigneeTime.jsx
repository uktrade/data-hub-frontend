import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Link, Table } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'

import {
  DefaultLayout,
  FieldInput,
  Form,
  FormLayout,
  StatusMessage,
} from '../../components'
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

const StyledLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${SPACING.SCALE_5};
`

const buildRows = (assignees) =>
  assignees.map(({ adviser, estimatedTime }, index) => (
    <Table.Row>
      <Table.Cell bold={true}>{adviser.name}</Table.Cell>
      <Table.Cell>
        <FormLayout setWidth={FORM_LAYOUT.ONE_HALF}>
          <FieldInput
            name={`${adviser.id}`}
            dataTest={`adviser-${index}`}
            type="text"
            initialValue={estimatedTime > 0 ? estimatedTime / 60 : null}
            validate={validateNumber}
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
          <Table.CellHeader setWidth="75%" />
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
            <DefaultLayout
              heading="Edit estimated hours of work"
              pageTitle={`Edit estimated hours of work - ${order.reference} - Orders (OMIS)`}
              breadcrumbs={[
                {
                  link: urls.dashboard.index(),
                  text: 'Home',
                },
                {
                  link: urls.omis.index(),
                  text: 'Orders (OMIS)',
                },
                {
                  link: urls.omis.order(order.id),
                  text: order.reference,
                },
                { text: 'Edit estimated hours of work' },
              ]}
            >
              {assignees.length > 0 ? (
                <AssigneeTimeTable order={order} assignees={assignees} />
              ) : (
                <NoAssigneesMessage order={order} />
              )}
            </DefaultLayout>
          )}
        </OrderAssigneesResource>
      )}
    </OrderResource>
  )
}

export default AssigneeTime
