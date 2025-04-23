import React, { useRef } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { GridCol, GridRow, H2, Table } from 'govuk-react'
import { LEVEL_SIZE, SPACING } from '@govuk-react/constants'
import { useReactToPrint } from 'react-to-print'

import {
  OrderInvoiceResource,
  OrderPaymentResource,
  OrderResource,
} from '../../components/Resource'
import OMISLayout from './OMISLayout'
import { DARK_GREY } from '../../utils/colours'
import { formatDate, DATE_FORMAT_FULL } from '../../utils/date-utils'
import { currencyGBP } from '../../utils/number-utils'
import { ButtonLink } from '../../components'
import urls from '../../../lib/urls'
import AccessibleLink from '../../components/Link'

const StyledSectionHeading = styled('p')`
  color: ${DARK_GREY};
  margin-bottom: ${SPACING.SCALE_1};
`

const StyledGridColLeft = styled(GridCol)`
  text-align: left;
`

const StyledGridColRight = styled(GridCol)`
  text-align: right;
`

const StyledTableCell = styled(Table.Cell)`
  border: 0;
  padding-bottom: 0;
`
const StyledButtonLink = styled(ButtonLink)`
  padding-left: 0;
  margin-left: 0;
  margin-bottom: 0;
  padding-top: ${SPACING.SCALE_3};
`

export const AddressSection = ({ invoice, paymentDate }) => (
  <GridRow>
    <StyledGridColLeft setWidth="one-half">
      <>
        <StyledSectionHeading data-test="attention-heading">
          For the attention of
        </StyledSectionHeading>
        <ul data-test="billing-address">
          {invoice.billingContactName && <li>{invoice.billingContactName}</li>}
          {invoice.billingAddress1 && <li>{invoice.billingAddress1}</li>}
          {invoice.billingAddress2 && <li>{invoice.billingAddress2}</li>}
          {invoice.billingAddressTown && <li>{invoice.billingAddressTown}</li>}
          {invoice.billingAddressCounty && (
            <li>{invoice.billingAddressCounty}</li>
          )}
          {invoice.billingAddressPostcode && (
            <li>{invoice.billingAddressPostcode}</li>
          )}
          {invoice.billingAddressCountry && (
            <li>{invoice.billingAddressCountry.name}</li>
          )}
        </ul>
        {invoice.poNumber && (
          <>
            <br />
            <StyledSectionHeading data-test="po-number-heading">
              Purchase order (PO) number
            </StyledSectionHeading>
            <p data-test="po-number">{invoice.poNumber}</p>
          </>
        )}
        <br />
        <StyledSectionHeading data-test="receipt-date-heading">
          Receipt date
        </StyledSectionHeading>
        {paymentDate && (
          <p data-test="receipt-date">
            {formatDate(paymentDate, DATE_FORMAT_FULL)}
          </p>
        )}
      </>
    </StyledGridColLeft>
    <StyledGridColRight setWidth="one-half">
      <>
        <StyledSectionHeading data-test="charging-point-heading">
          From (charging point)
        </StyledSectionHeading>
        <ul data-test="company-address">
          {invoice.invoiceCompanyName && <li>{invoice.invoiceCompanyName}</li>}
          {invoice.invoiceAddress1 && <li>{invoice.invoiceAddress1}</li>}
          {invoice.invoiceAddress2 && <li>{invoice.invoiceAddress2}</li>}
          {invoice.invoiceAddressTown && <li>{invoice.invoiceAddressTown}</li>}
          {invoice.invoiceAddressCounty && (
            <li>{invoice.invoiceAddressCounty}</li>
          )}
          {invoice.invoiceAddressPostcode && (
            <li>{invoice.invoiceAddressPostcode}</li>
          )}
          {invoice.invoiceAddressCountry && (
            <li>{invoice.invoiceAddressCountry.name}</li>
          )}
        </ul>
        <br />
        {invoice.invoiceVatNumber && (
          <>
            <StyledSectionHeading data-test="vat-number-heading">
              VAT number
            </StyledSectionHeading>
            <p data-test="vat-number">{invoice.invoiceVatNumber}</p>
          </>
        )}
      </>
    </StyledGridColRight>
  </GridRow>
)

export const OrderDetailsSection = ({ order }) => (
  <GridRow>
    <GridCol>
      <Table data-test="order-details-table">
        <Table.Row>
          <Table.CellHeader>Order number</Table.CellHeader>
          <Table.CellHeader>Service description</Table.CellHeader>
          <Table.CellHeader>Market (country)</Table.CellHeader>
          <Table.Cell />
          <Table.CellHeader>Net amount</Table.CellHeader>
        </Table.Row>
        <Table.Row>
          <Table.Cell>{order.reference}</Table.Cell>
          <Table.Cell>OMIS</Table.Cell>
          <Table.Cell>{order.primaryMarket.name}</Table.Cell>
          <Table.Cell />
          <Table.Cell>{currencyGBP(order.subtotalCost / 100)}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <StyledTableCell />
          <StyledTableCell />
          <StyledTableCell />
          <Table.CellHeader>{`VAT${
            order.vatCost > 0 ? ' at 20%' : ''
          }`}</Table.CellHeader>
          <Table.Cell>{currencyGBP(order.vatCost / 100)}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <StyledTableCell />
          <StyledTableCell />
          <StyledTableCell />
          <Table.CellHeader>Total amount</Table.CellHeader>
          <Table.Cell>{currencyGBP(order.totalCost / 100)}</Table.Cell>
        </Table.Row>
      </Table>
    </GridCol>
  </GridRow>
)

export const PaymentSection = ({
  payment,
  orderId,
  reconciliationJourney,
  handlePrint,
}) => (
  <GridRow>
    <StyledGridColLeft setWidth="one-half" data-test="payment-section">
      <H2 size={LEVEL_SIZE[3]}>Payment details</H2>
      <StyledSectionHeading>Method</StyledSectionHeading>
      <p>{payment[0].method.toUpperCase()}</p>
      <StyledSectionHeading>Amount received</StyledSectionHeading>
      <p>{currencyGBP(payment[0].amount / 100)}</p>
      <StyledSectionHeading>Received on</StyledSectionHeading>
      <p>{formatDate(payment[0].receivedOn, DATE_FORMAT_FULL)}</p>
      {payment[0].transactionReference && (
        <>
          <StyledSectionHeading>Transaction reference</StyledSectionHeading>
          <p>{payment[0].transactionReference}</p>
        </>
      )}
      {reconciliationJourney ? (
        <AccessibleLink
          href={urls.omis.reconciliation()}
          data-test="reconciliation-link"
        >
          Reconcile another order
        </AccessibleLink>
      ) : (
        <AccessibleLink href={urls.omis.order(orderId)} data-test="order-link">
          Return to order
        </AccessibleLink>
      )}
      <br />
      <StyledButtonLink onClick={handlePrint} data-test="print-link">
        Print payment receipt
      </StyledButtonLink>
      <br />
      <br />
    </StyledGridColLeft>
  </GridRow>
)

const PaymentReceipt = () => {
  const { orderId } = useParams()
  const printRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Payment receipt - Orders (OMIS)',
  })
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <OMISLayout heading="Payment receipt" order={order}>
          <div ref={printRef}>
            <OrderInvoiceResource id={orderId}>
              {(invoice) => (
                <AddressSection invoice={invoice} paymentDate={order.paidOn} />
              )}
            </OrderInvoiceResource>
            <OrderDetailsSection order={order} />
            <OrderPaymentResource id={orderId}>
              {(payment) => (
                <PaymentSection
                  payment={payment}
                  orderId={order.id}
                  reconciliationJourney={location.pathname.includes(
                    '/reconciliation'
                  )}
                  handlePrint={handlePrint}
                />
              )}
            </OrderPaymentResource>
          </div>
        </OMISLayout>
      )}
    </OrderResource>
  )
}

export default PaymentReceipt
