import React from 'react'
import { useParams } from 'react-router-dom'
import { Details, Table } from 'govuk-react'

import { FieldCheckboxes, FieldInput, Form, FormLayout } from '../../components'
import {
  OrderResource,
  OrderAssigneesResource,
} from '../../components/Resource'
import urls from '../../../lib/urls'
import { FORM_LAYOUT } from '../../../common/constants'
import { validateNumber } from './validators'
import { TASK_COMPLETE_ORDER } from './state'
import {
  transformActualAssigneeTimeForApi,
  transformEstimatedTime,
} from './transformers'
import OMISLayout from './OMISLayout'

const buildRows = (assignees) =>
  assignees.map(({ adviser, estimatedTime }, index) => (
    <Table.Row key={adviser.id}>
      <Table.Cell bold={true}>{adviser.name}</Table.Cell>
      <Table.Cell>{transformEstimatedTime(estimatedTime)}</Table.Cell>
      <Table.Cell>
        <FormLayout setWidth={FORM_LAYOUT.ONE_HALF}>
          <FieldInput
            name={`${adviser.id}`}
            dataTest={`adviser-${index}`}
            type="text"
            validate={validateNumber}
            required="Enter the number of actual hours worked"
            aria-label={`Actual hours worked by ${adviser.name}`}
          />
        </FormLayout>
      </Table.Cell>
    </Table.Row>
  ))

export const CompleteAssigneesTable = ({ order, assignees }) => (
  <>
    <p data-test="completion-message">
      Complete the order after all work has been sent to the contact.
    </p>
    <FormLayout setWidth={FORM_LAYOUT.TWO_THIRDS}>
      <Form
        id="complete-order"
        analyticsFormName="completeOrder"
        submitButtonLabel="Complete order"
        cancelButtonLabel="Return without saving"
        cancelRedirectTo={() => urls.omis.order(order.id)}
        flashMessage={() => 'Order completed'}
        redirectTo={() => urls.omis.order(order.id)}
        submissionTaskName={TASK_COMPLETE_ORDER}
        transformPayload={(values) =>
          transformActualAssigneeTimeForApi({
            orderId: order.id,
            values,
          })
        }
      >
        <Table data-test="actual-hours-table">
          <Table.Row>
            <Table.Cell setWidth="33%" />
            <Table.CellHeader setWidth="33%">
              Original estimate
            </Table.CellHeader>
            <Table.CellHeader setWidth="33%">
              Actual hours worked
            </Table.CellHeader>
          </Table.Row>
          {buildRows(assignees)}
        </Table>
        <Details
          summary="Why do I need to provide hours worked?"
          data-test="why-provide-details"
        >
          This information will not be used to analyse individual performance.
          <br />
          <br />
          The actual hours worked can be different to those in the original
          estimate.
          <br />
          <br />
          This information won't be shared with the client, and won't change how
          much the client has to pay for the work.
        </Details>
        <FieldCheckboxes
          name="hasWorkBeenSentToContact"
          required="This order cannot be completed until the work has been sent to the contact"
          options={[
            {
              value: 'Yes',
              label: 'I have completed the work and sent this to the contact',
            },
          ]}
        />
      </Form>
    </FormLayout>
  </>
)

const CompleteOrder = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OrderAssigneesResource id={orderId}>
          {(assignees) => (
            <OMISLayout heading="Complete order" order={order}>
              <CompleteAssigneesTable order={order} assignees={assignees} />
            </OMISLayout>
          )}
        </OrderAssigneesResource>
      )}
    </OrderResource>
  )
}

export default CompleteOrder
