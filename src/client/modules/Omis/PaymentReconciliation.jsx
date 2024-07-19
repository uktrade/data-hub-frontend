import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Button, Details, H2, Link, Table } from 'govuk-react'
import { LEVEL_SIZE, SPACING } from '@govuk-react/constants'

import {
  FieldCurrency,
  FieldDate,
  Form,
  FormLayout,
  StatusMessage,
} from '../../components'
import {
  CompanyResource,
  OrderResource,
  OrderInvoiceResource,
} from '../../components/Resource'
import urls from '../../../lib/urls'
import { currencyGBP } from '../../utils/number-utils'
import { format, getDifferenceInWords } from '../../utils/date'
import { DATE_LONG_FORMAT_1, FORM_LAYOUT } from '../../../common/constants'
import { validateAmountRecieved, validateIfDateInPast } from './validators'
import { TASK_RECONCILE_OMIS_PAYMENT } from './state'
import {
  transformPaymentInformationForApi,
  transformCompanyAddress,
} from './transformers'
import { STATUS } from './constants'
import OMISLayout from './OMISLayout'

const StyledLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${SPACING.SCALE_5};
`

export const QuoteNotAcceptedMessage = ({ orderId }) => (
  <>
    <StatusMessage>
      The quote for this order has not been accepted so payment cannot be
      reconciled.
    </StatusMessage>
    <StyledLink href={urls.omis.order(orderId)} data-test="return-link">
      Return
    </StyledLink>
  </>
)

export const OrderCancelledMessage = ({ orderId }) => (
  <>
    <StatusMessage>
      This order has been cancelled and it is no longer possible to reconcile
      the payment.
    </StatusMessage>
    <StyledLink href={urls.omis.order(orderId)} data-test="return-link">
      Return
    </StyledLink>
  </>
)

export const OrderPaidMessage = ({ orderId }) => (
  <>
    <StatusMessage>This order has been paid in full.</StatusMessage>
    <Button
      as={'a'}
      href={urls.omis.paymentReceipt(orderId)}
      data-test="view-receipt-button"
    >
      View payment receipt
    </Button>
    <br />
    <StyledLink href={urls.omis.order(orderId)} data-test="return-link">
      Return
    </StyledLink>
  </>
)

export const CompanyDetails = ({ company }) => (
  <>
    <H2 size={LEVEL_SIZE[3]} data-test="company-heading">
      Company details
    </H2>
    <p data-test="company-name">{company.name}</p>
    <p data-test="company-address">{transformCompanyAddress(company)}</p>
  </>
)

export const InvoiceDetails = ({ invoice, reference }) => (
  <>
    <H2 size={LEVEL_SIZE[3]} data-test="invoice-heading">
      Invoice details
    </H2>
    <Table data-test="invoice-table">
      <Table.Row>
        <Table.CellHeader>Order reference</Table.CellHeader>
        <Table.Cell>{reference}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>Amount (excluding VAT)</Table.CellHeader>
        <Table.Cell>{currencyGBP(invoice.subtotalCost / 100)}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>Amount (including VAT)</Table.CellHeader>
        <Table.Cell>{currencyGBP(invoice.totalCost / 100)}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.CellHeader>Payment due date</Table.CellHeader>
        <Table.Cell>
          {format(invoice.paymentDueDate, DATE_LONG_FORMAT_1) +
            ' (' +
            getDifferenceInWords(invoice.paymentDueDate) +
            ')'}
        </Table.Cell>
      </Table.Row>
    </Table>
  </>
)

const PaymentReconciliation = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OMISLayout heading="Reconcile a payment" order={order}>
          {(order.status === STATUS.DRAFT ||
            order.status === STATUS.QUOTE_AWAITING_ACCEPTANCE) && (
            <QuoteNotAcceptedMessage orderId={order.id} />
          )}
          {order.status === STATUS.CANCELLED && (
            <OrderCancelledMessage orderId={order.id} />
          )}
          {(order.status === STATUS.PAID ||
            order.status === STATUS.COMPLETE) && (
            <OrderPaidMessage orderId={order.id} />
          )}
          {order.status === STATUS.QUOTE_ACCEPTED && (
            <OrderInvoiceResource id={orderId}>
              {(invoice) => (
                <>
                  <CompanyResource id={order.company.id}>
                    {(company) => <CompanyDetails company={company} />}
                  </CompanyResource>
                  <InvoiceDetails
                    invoice={invoice}
                    reference={order.reference}
                  />
                  <H2 size={LEVEL_SIZE[3]}>Payment details</H2>
                  <FormLayout setWidth={FORM_LAYOUT.ONE_HALF}>
                    <Form
                      id="reconcile-order-payment"
                      analyticsFormName="reconcileOrderPayment"
                      submitButtonLabel="Reconcile payment"
                      cancelButtonLabel="Return without saving"
                      cancelRedirectTo={() => urls.omis.order(order.id)}
                      flashMessage={() =>
                        `Payment for ${order.reference} reconciled`
                      }
                      redirectTo={() =>
                        urls.omis.paymentReceiptReconciliation(order.id)
                      }
                      submissionTaskName={TASK_RECONCILE_OMIS_PAYMENT}
                      transformPayload={(values) =>
                        transformPaymentInformationForApi({
                          orderId,
                          values,
                        })
                      }
                    >
                      <FieldCurrency
                        name="amount"
                        label="Amount received"
                        hint="Enter the amount in GBP"
                        required="Enter the amount recieved"
                        validate={(value) =>
                          validateAmountRecieved(value, invoice.totalCost)
                        }
                      />

                      <FieldDate
                        name="received_on"
                        label="Payment received date"
                        hint="For example 28 10 2017"
                        required="Enter the date the payment was recieved"
                        validate={validateIfDateInPast}
                      />

                      <Details
                        data-test="something-wrong-details"
                        summary="Is something wrong with the payment?"
                      >
                        <Link href={urls.omis.workOrder(order.id)}>
                          View the order
                        </Link>{' '}
                        to contact an adviser in the UK or contact{' '}
                        <Link href={'mailto:omis.orders@digital.trade.gov.uk'}>
                          omis.orders@digital.trade.gov.uk
                        </Link>
                        .
                      </Details>
                    </Form>
                  </FormLayout>
                </>
              )}
            </OrderInvoiceResource>
          )}
        </OMISLayout>
      )}
    </OrderResource>
  )
}

export default PaymentReconciliation
