import React from 'react'
import styled from 'styled-components'
import { InsetText } from 'govuk-react'

import { SummaryTable } from '../../../components'
import {
  canEditOrder,
  getAddress,
  isOrderActive,
  transformAddress,
} from '../transformers'
import { VAT_STATUS } from '../constants'
import urls from '../../../../lib/urls'
import { currencyGBP } from '../../../utils/number-utils'
import AccessibleLink from '../../../components/Link'

const StyledInset = styled(InsetText)`
  margin-top: -10px;
  font-size: 16px;
`

const setPrice = (order) => {
  const formattedPrice = currencyGBP(order.totalCost / 100)
  return order.vatCost > 0
    ? `${formattedPrice} (${currencyGBP(
        order.subtotalCost / 100
      )} excluding VAT)`
    : order.discountValue
      ? `${formattedPrice} (includes a net discount of ${currencyGBP(
          order.discountValue
        )})`
      : `${formattedPrice} (No VAT applies)`
}

const transformVATStatus = (vatStatus) =>
  vatStatus === VAT_STATUS.EU_COMPANY
    ? 'Inside EU'
    : vatStatus === VAT_STATUS.UK_COMPANY
      ? 'Inside UK'
      : 'Outside EU'

const transformOrderAddress = (company, order) => {
  const address = getAddress(order, company)
  const transformedAddress = transformAddress(address).join(', ')
  return address === company.address ||
    address === company.registeredAddress ? (
    <>
      <p>{transformedAddress}</p>
      <StyledInset data-test="company-address-inset">
        The company's address is currently being used for the invoice.
      </StyledInset>
    </>
  ) : (
    transformedAddress
  )
}

const InvoiceDetailsTable = ({ order, company }) => (
  <SummaryTable
    caption="Invoice details"
    data-test="invoice-details-table"
    actions={
      (canEditOrder(order) || isOrderActive(order)) && (
        <AccessibleLink
          key="editInvoiceDetailsLink"
          href={urls.omis.edit.invoiceDetails(order.id)}
          data-test="edit-invoice-details-link"
          noVisitedState={true}
        >
          Edit
        </AccessibleLink>
      )
    }
  >
    <SummaryTable.Row heading="Price">
      {order.totalCost
        ? setPrice(order)
        : 'Estimated hours and VAT category must be set to calculate price'}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Billing address">
      {transformOrderAddress(company, order)}
    </SummaryTable.Row>
    <SummaryTable.Row heading="VAT category">
      {order.vatStatus ? transformVATStatus(order.vatStatus) : 'Not set'}
    </SummaryTable.Row>
    <SummaryTable.Row heading="VAT number" hideWhenEmpty={true}>
      {order.vatNumber
        ? order.vatVerified
          ? `${order.vatNumber} (Valid)`
          : `${order.vatNumber} (Invalid)`
        : null}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Purchase Order (PO) number">
      {order.poNumber || 'Not added'}
    </SummaryTable.Row>
  </SummaryTable>
)

export default InvoiceDetailsTable
