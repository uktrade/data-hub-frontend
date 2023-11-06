import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout } from '../../components'
import { OrderResource, OrderQuoteResource } from '../../components/Resource'
import urls from '../../../lib/urls'
import { STATUS } from './constants'
import OMISLocalHeader from './OMISLocalHeader'

const WorkOrder = () => {
  const { orderId } = useParams()
  return (
    <OrderResource id={orderId}>
      {(order) => (
        <DefaultLayout
          heading={order.reference}
          pageTitle={`${order.reference} - Orders (OMIS)`}
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
              text: order.reference,
            },
          ]}
          localHeaderChildren={
            order.status === STATUS.QUOTE_AWAITING_ACCEPTANCE ? (
              <OrderQuoteResource id={order.id}>
                {(quote) => <OMISLocalHeader order={order} quote={quote} />}
              </OrderQuoteResource>
            ) : (
              <OMISLocalHeader order={order} quote={null} />
            )
          }
        >
          <p>{order.id}</p>
        </DefaultLayout>
      )}
    </OrderResource>
  )
}

export default WorkOrder
