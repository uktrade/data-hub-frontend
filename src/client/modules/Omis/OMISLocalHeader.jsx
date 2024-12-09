import React from 'react'
import styled from 'styled-components'
import { Button, GridCol, GridRow, Link } from 'govuk-react'
import { FONT_WEIGHTS } from '@govuk-react/constants'

import LocalHeaderDetails from '../../components/LocalHeaderDetails'
import { getDifferenceInWords, isDateInFuture } from '../../utils/date'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../utils/date-utils'
import { STATUS } from './constants'
import urls from '../../../lib/urls'

const StyledWrapper = styled('div')`
  text-align: right;
`

const StyledButtonWrapper = styled('div')`
  margin-bottom: -30px;
`

const StyledLink = styled(Link)`
  font-weight: ${FONT_WEIGHTS.bold};
`

const getExpiryDate = (expiresOn) =>
  isDateInFuture(expiresOn)
    ? ` (expires ${getDifferenceInWords(expiresOn)})`
    : ` (expired ${getDifferenceInWords(expiresOn)})`

const getCompletionDate = (completedOn) =>
  `d (${getDifferenceInWords(completedOn)})`

const transformStatus = (order, quote) => {
  const noUnderscores = order.status.replace(/_/g, ' ')
  const transformedStatus =
    noUnderscores.charAt(0).toUpperCase() + noUnderscores.slice(1)
  return order.status === STATUS.QUOTE_AWAITING_ACCEPTANCE
    ? transformedStatus + getExpiryDate(quote.expiresOn)
    : order.status === STATUS.COMPLETE && order.completedOn
      ? transformedStatus + getCompletionDate(order.completedOn)
      : transformedStatus
}

const setHeaderItems = (order, quote) => {
  const items = [
    {
      label: 'Company',
      value: (
        <Link
          href={urls.companies.details(order.company.id)}
          data-test="company-link"
          noVisitedState={true}
        >
          {order.company.name}
        </Link>
      ),
    },
    { label: 'Country (market)', value: order.primaryMarket.name },
  ]
  const secondItems = [
    {
      label: 'Created on',
      value: formatDate(order.createdOn, DATE_FORMAT_MEDIUM_WITH_TIME),
    },
    {
      label: 'Updated on',
      value: formatDate(order.modifiedOn, DATE_FORMAT_MEDIUM_WITH_TIME),
    },
    {
      label: 'Status',
      value: transformStatus(order, quote),
    },
  ]
  return order.ukRegion
    ? secondItems.unshift({
        label: 'UK region',
        value: order.ukRegion?.name || '',
      }) && items.concat(secondItems)
    : items.concat(secondItems)
}

const CancelLink = ({ orderId }) => (
  <StyledLink
    href={urls.omis.cancel(orderId)}
    data-test="cancel-link"
    noVisitedState={true}
  >
    Cancel order
  </StyledLink>
)

const ViewQuoteLink = ({ orderId }) => (
  <StyledLink
    href={urls.omis.quote(orderId)}
    data-test="quote-link"
    noVisitedState={true}
  >
    View quote
  </StyledLink>
)

const ViewReceiptLink = ({ orderId }) => (
  <StyledLink
    href={urls.omis.paymentReceipt(orderId)}
    data-test="receipt-link"
    noVisitedState={true}
  >
    View payment receipt
  </StyledLink>
)

const DraftActions = ({ orderId, incompleteFields }) => (
  <StyledWrapper>
    <StyledButtonWrapper>
      {incompleteFields.length === 0 ? (
        <Button
          as={'a'}
          href={urls.omis.quote(orderId)}
          data-test="preview-quote-button"
        >
          Preview quote
        </Button>
      ) : (
        <Button
          href={urls.omis.quote(orderId)}
          data-test="preview-quote-button-disabled"
          disabled={true}
        >
          Preview quote
        </Button>
      )}
    </StyledButtonWrapper>
    <br />
    <CancelLink orderId={orderId} />
  </StyledWrapper>
)

const QuoteAwaitingAcceptanceActions = ({ orderId }) => (
  <StyledWrapper>
    <ViewQuoteLink orderId={orderId} />
    <br />
    <br />
    <CancelLink orderId={orderId} />
  </StyledWrapper>
)

const QuoteAcceptedActions = ({ orderId }) => (
  <StyledWrapper>
    <ViewQuoteLink orderId={orderId} />
  </StyledWrapper>
)

const PaidActions = ({ orderId }) => (
  <StyledWrapper>
    <StyledButtonWrapper>
      <Button
        as={'a'}
        href={urls.omis.complete(orderId)}
        data-test="complete-button"
      >
        Complete order
      </Button>
    </StyledButtonWrapper>
    <br />
    <ViewReceiptLink orderId={orderId} />
    <br />
    <br />
    <ViewQuoteLink orderId={orderId} />
  </StyledWrapper>
)

const CompleteActions = ({ orderId }) => (
  <StyledWrapper>
    <ViewReceiptLink orderId={orderId} />
    <br />
    <br />
    <ViewQuoteLink orderId={orderId} />
  </StyledWrapper>
)

const CancelledActions = ({ orderId }) => (
  <StyledWrapper>
    <ViewQuoteLink orderId={orderId} />
  </StyledWrapper>
)

const OMISLocalHeader = ({ order, quote, incompleteFields }) => (
  <GridRow>
    <GridCol setWidth="75%">
      <LocalHeaderDetails items={setHeaderItems(order, quote)} />
    </GridCol>
    <GridCol>
      {order.status === STATUS.DRAFT && (
        <DraftActions orderId={order.id} incompleteFields={incompleteFields} />
      )}
      {order.status === STATUS.QUOTE_AWAITING_ACCEPTANCE && (
        <QuoteAwaitingAcceptanceActions orderId={order.id} />
      )}
      {order.status === STATUS.QUOTE_ACCEPTED && (
        <QuoteAcceptedActions orderId={order.id} />
      )}
      {order.status === STATUS.PAID && <PaidActions orderId={order.id} />}
      {order.status === STATUS.COMPLETE && (
        <CompleteActions orderId={order.id} />
      )}
      {order.status === STATUS.CANCELLED && (
        <CancelledActions orderId={order.id} />
      )}
    </GridCol>
  </GridRow>
)

export default OMISLocalHeader
