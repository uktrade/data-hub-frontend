import React from 'react'
import styled from 'styled-components'
import { Link, ListItem, UnorderedList } from 'govuk-react'
import { kebabCase } from 'lodash'

import { StatusMessage } from '../../components'
import ArchivePanel from '../../components/ArchivePanel'
import { INCOMPLETE_FIELD_MESSAGES, STATUS } from './constants'
import urls from '../../../lib/urls'
import { BLUE } from '../../utils/colours'
import { getIncompleteFields, mapFieldToUrl } from './transformers'

const StyledListItem = styled(ListItem)`
  color: ${BLUE};
  font-weight: bold;
  line-height: 1.5;
`

const OrderIncompleteFields = ({ order, assignees }) => (
  <>
    {order.status === STATUS.QUOTE_AWAITING_ACCEPTANCE && (
      <StatusMessage data-test="withdraw-quote-message">
        You cannot edit the order once a quote has been sent.
        <br />
        <br />
        <Link href={urls.omis.quote(order.id)} data-test="withdraw-quote-link">
          Withdraw the quote
        </Link>{' '}
        to edit the order.
      </StatusMessage>
    )}
    {order.status === STATUS.CANCELLED && (
      <ArchivePanel
        archivedBy={order.cancelledBy?.name}
        archivedOn={order.cancelledOn}
        archiveReason={order.cancellationReason?.name}
        type="order"
        archiveMessage="cancelled"
      />
    )}
    {order.status === STATUS.DRAFT &&
    getIncompleteFields(order, assignees).length > 0 ? (
      <StatusMessage data-test="incomplete-fields-message">
        To preview the quote you must complete the following:
        <UnorderedList listStyleType="bullet">
          {getIncompleteFields(order, assignees).map((field, i) => (
            <StyledListItem key={i}>
              {field === INCOMPLETE_FIELD_MESSAGES.LEAD_ASSIGNEE ? (
                field
              ) : (
                <Link
                  href={mapFieldToUrl(field, order.id)}
                  data-test={`${kebabCase(field)}-link`}
                >
                  {field}
                </Link>
              )}
            </StyledListItem>
          ))}
        </UnorderedList>
      </StatusMessage>
    ) : null}
  </>
)

export default OrderIncompleteFields
