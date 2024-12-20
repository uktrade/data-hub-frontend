import React from 'react'
import { isFuture } from 'date-fns'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Details, H1, InsetText, Link, WarningText } from 'govuk-react'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import { DefaultLayout, Form } from '../../components'
import {
  ContactResource,
  OrderQuoteResource,
  OrderResource,
} from '../../components/Resource'
import Task from '../../components/Task'
import {
  PREVIEW_QUOTE_ID,
  TASK_CANCEL_QUOTE,
  TASK_CREATE_QUOTE,
  TASK_PREVIEW_QUOTE,
  quoteState2props,
} from './state'
import { ORDERS__QUOTE_PREVIEW_LOADED } from '../../actions'
import OMISTermsAndConditions from './OMISTermsAndConditions'
import urls from '../../../lib/urls'
import { DARK_GREY, RED_2 } from '../../utils/colours'
import {
  formatDate,
  DATE_FORMAT_MEDIUM,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../utils/date-utils'
import { STATUS } from './constants'

const StyledInsetText = styled(InsetText)`
  margin-bottom: -${SPACING.SCALE_2};
`

const StyledContactEmail = styled('p')`
  font-size: ${FONT_SIZE.SIZE_24};
  margin-bottom: -${SPACING.SCALE_1};
`

const StyledHeading = styled('p')`
  color: ${DARK_GREY};
  margin-top: -${SPACING.SCALE_1};
`

const StyledP = styled('p')`
  margin-top: -${SPACING.SCALE_2};
`

const StyledWarningText = styled(WarningText)`
  margin-bottom: ${SPACING.SCALE_4};
`

const SetHeading = ({ id }) => (
  <OrderResource.Inline id={id}>
    {(order) => (order.status === STATUS.DRAFT ? 'Quote preview' : 'Quote')}
  </OrderResource.Inline>
)

const OrderReference = ({ id }) => (
  <OrderResource.Inline id={id}>
    {(order) => order.reference}
  </OrderResource.Inline>
)

const ContactEmail = ({ id }) => (
  <ContactResource.Inline id={id}>
    {(contact) => contact.email}
  </ContactResource.Inline>
)

const getQuoteDate = (quote) => {
  if (quote) {
    const splitQuote = quote.split('\n')
    return splitQuote.splice(0, 1)
  }
}

const pruneQuote = (quote) => {
  if (quote) {
    const lines = quote.split('\n')
    lines.splice(0, 4)
    return lines.join('\n')
  }
  return null
}

export const RenderQuote = ({ quote, reference }) => (
  <>
    <p data-test="quote-date">{getQuoteDate(quote)}</p>
    <H1 data-test="quote-heading">
      Quote for the Provision of an Overseas Market Introduction Service
      ("OMIS"): {reference} (the Quote)
    </H1>
    <p data-test="quote">
      <Markdown remarkPlugins={[remarkGfm]}>{pruneQuote(quote)}</Markdown>
    </p>
    <Details summary="View full terms and conditions" data-test="quote-terms">
      <OMISTermsAndConditions />
    </Details>
  </>
)

const setExpiryLabel = (quote) =>
  isFuture(quote.expiresOn) ? 'Expires on' : 'Expired on'

const SentOn = ({ quote }) => (
  <>
    <StyledHeading data-test="sent-on-heading">Sent on</StyledHeading>
    <StyledP data-test="sent-on-date">
      {formatDate(quote.createdOn, DATE_FORMAT_MEDIUM_WITH_TIME)}
    </StyledP>
    <StyledHeading data-test="sent-by-heading">Sent by</StyledHeading>
    {quote.createdBy && (
      <StyledP data-test="sent-by-name">{quote.createdBy.name}</StyledP>
    )}
  </>
)

const AcceptedOn = ({ quote }) => (
  <>
    <StyledHeading data-test="accepted-on-heading">Accepted on</StyledHeading>
    <StyledP data-test="accepted-on-date">
      {formatDate(quote.acceptedOn, DATE_FORMAT_MEDIUM_WITH_TIME)}
    </StyledP>
    <StyledHeading data-test="accepted-by-heading">Accepted by</StyledHeading>
    <StyledP data-test="accepted-by-name">{quote.acceptedBy.name}</StyledP>
  </>
)

const ReturnToOrder = ({ orderId }) => (
  <>
    <Link href={urls.omis.workOrder(orderId)} data-test="return-link">
      Return to order
    </Link>
    <br />
    <br />
  </>
)

const OrderQuote = ({ quotePreview }) => {
  const { orderId } = useParams()
  return (
    <DefaultLayout
      heading={<SetHeading id={orderId} />}
      pageTitle={
        <p>
          <SetHeading id={orderId} />
          {' - '}
          <OrderReference id={orderId} />
          {' - Orders (OMIS)'}
        </p>
      }
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
          link: urls.omis.order(orderId),
          text: <OrderReference id={orderId} />,
        },
        { text: <SetHeading id={orderId} /> },
      ]}
    >
      <OrderResource id={orderId}>
        {(order) => (
          <>
            {order.status === STATUS.DRAFT && (
              <Task.Status
                name={TASK_PREVIEW_QUOTE}
                id={PREVIEW_QUOTE_ID}
                progressMessage="loading quote preview"
                startOnRender={{
                  payload: orderId,
                  onSuccessDispatch: ORDERS__QUOTE_PREVIEW_LOADED,
                }}
              >
                {() => (
                  <Form
                    id="create-omis-quote"
                    analyticsFormName="createOmisQuote"
                    submissionTaskName={TASK_CREATE_QUOTE}
                    transformPayload={() => ({
                      id: orderId,
                    })}
                    redirectTo={() => urls.omis.workOrder(orderId)}
                    cancelRedirectTo={() => urls.omis.workOrder(orderId)}
                    submitButtonLabel="Send quote to client"
                    cancelButtonLabel="Return to order"
                    flashMessage={() => 'Quote sent to client'}
                  >
                    {quotePreview && (
                      <>
                        <StyledHeading data-test="expiry-heading">
                          Will expire on
                        </StyledHeading>
                        <p data-test="expiry-date">
                          {formatDate(
                            quotePreview?.expires_on,
                            DATE_FORMAT_MEDIUM
                          )}
                        </p>
                        <RenderQuote
                          quote={quotePreview ? quotePreview?.content : ''}
                          reference={order.reference}
                        />
                        <WarningText data-test="preview-warning">
                          Quotes should be reviewed by a manager before being
                          sent.
                        </WarningText>
                        <StyledInsetText data-test="contact-email">
                          An email with a link to this quote will be sent to:
                          <br />
                          <StyledContactEmail>
                            {order.contactEmail ? (
                              order.contactEmail
                            ) : (
                              <ContactEmail id={order.contact.id} />
                            )}
                          </StyledContactEmail>
                        </StyledInsetText>
                        <br />
                      </>
                    )}
                  </Form>
                )}
              </Task.Status>
            )}
            {order.status === STATUS.QUOTE_AWAITING_ACCEPTANCE && (
              <OrderQuoteResource id={orderId}>
                {(quote) => (
                  <Form
                    id="cancel-omis-quote"
                    analyticsFormName="cancelOmisQuote"
                    submissionTaskName={TASK_CANCEL_QUOTE}
                    transformPayload={() => ({
                      id: orderId,
                    })}
                    redirectTo={() => urls.omis.workOrder(orderId)}
                    cancelRedirectTo={() => urls.omis.workOrder(orderId)}
                    submitButtonLabel="Withdraw quote"
                    submitButtonColour={RED_2}
                    cancelButtonLabel="Return to order"
                    flashMessage={() => 'Quote withdrawn'}
                  >
                    <StyledHeading data-test="expires-on-heading">
                      {setExpiryLabel(quote)}
                    </StyledHeading>
                    <StyledP data-test="expires-on-date">
                      {formatDate(quote.expiresOn, DATE_FORMAT_MEDIUM)}
                    </StyledP>

                    <SentOn quote={quote} />
                    <RenderQuote
                      quote={quote.content}
                      reference={order.reference}
                    />
                    <StyledWarningText data-test="awaiting-acceptance-warning">
                      The client will no longer be able to accept the quote once
                      it has been withdrawn.
                      <br />
                      They will be notified by email.
                    </StyledWarningText>
                  </Form>
                )}
              </OrderQuoteResource>
            )}
            {order.status != STATUS.DRAFT &&
              order.status != STATUS.QUOTE_AWAITING_ACCEPTANCE && (
                <OrderQuoteResource id={orderId}>
                  {(quote) => (
                    <>
                      <SentOn quote={quote} />
                      <AcceptedOn quote={quote} />
                      {order.status === STATUS.CANCELLED && (
                        <>
                          <StyledHeading data-test="cancelled-on-heading">
                            Cancelled on
                          </StyledHeading>
                          <StyledP data-test="cancelled-on-date">
                            {formatDate(
                              quote.cancelledOn,
                              DATE_FORMAT_MEDIUM_WITH_TIME
                            )}
                          </StyledP>
                          <StyledHeading data-test="cancelled-by-heading">
                            Cancelled by
                          </StyledHeading>
                          <StyledP data-test="cancelled-by-name">
                            {quote.cancelledBy.name}
                          </StyledP>
                        </>
                      )}
                      <RenderQuote
                        quote={quote.content}
                        reference={order.reference}
                      />
                      <ReturnToOrder orderId={orderId} />
                    </>
                  )}
                </OrderQuoteResource>
              )}
          </>
        )}
      </OrderResource>
    </DefaultLayout>
  )
}

export default connect(quoteState2props)(OrderQuote)
